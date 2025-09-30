import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import type { BlokType, StoryblokLink, StoryType } from '../types';
import {
  extractSlugFromUrl,
  isIndividualStoryRequest,
  isStoriesOrLinksRequest,
  isStoryblokCdnRequest,
  isStoryblokCdnResponse,
  joinPaths,
  standardErrorHandler,
} from './shared-utils';

export interface StoryblokPathConfigOptions {
  /**
   * The base path to automatically append to starts_with parameter
   * for Stories and GetLinks API calls
   */
  basePath: `${string}/`;
  /**
   * Whether to rewrite response data by removing the basePath from story paths
   * This WILL mutate the Storyblok response
   * @default false
   */
  rewriteLinks?: boolean;
}

/**
 * Factory function that creates a Storyblok path configuration middleware
 *
 * This middleware automatically handles base path configuration for Storyblok API calls:
 * - For Stories and GetLinks API calls: appends a `starts_with` query parameter with the configured base path
 * - For individual story requests: prepends the base path to the story slug in the URL
 * - Optionally removes the basePath from response data paths when `rewriteLinks` is enabled
 * If a `starts_with` parameter is already present, it will be left unchanged.
 *
 * @param config - Configuration for the path middleware
 * @returns A middleware function that can be applied to an AxiosInstance
 *
 * @example
 * ```typescript
 * import { storyblokPathConfig } from "@virginmediao2/storyblok-sdk";
 *
 * const pathMiddleware = storyblokPathConfig({
 *   basePath: "blog/",
 *   rewriteLinks: true // Optional: rewrite response paths
 * });
 *
 * // Apply to axios instance
 * pathMiddleware(axiosInstance);
 *
 * // This will automatically:
 * // - Add starts_with=blog/ to /stories and /links requests
 * // - Transform /stories/my-article to /stories/blog/my-article
 * // - If rewriteLinks=true: Remove "blog/" from response paths: "blog/my-article" -> "/my-article"
 * ```
 */
export const storyblokPathConfig =
  (config: StoryblokPathConfigOptions) =>
  (axiosInstance: AxiosInstance): void => {
    axiosInstance.interceptors.request.use(
      (requestConfig: InternalAxiosRequestConfig) => {
        // Only apply to Storyblok CDN requests
        if (!isStoryblokCdnRequest(requestConfig)) {
          return requestConfig;
        }

        // Check if this is a Stories or GetLinks API call
        if (!isStoriesOrLinksRequest(requestConfig)) {
          return requestConfig;
        }

        const url = requestConfig.url || '';

        // Handle individual story requests (e.g., /stories/some-slug)
        if (isIndividualStoryRequest(url)) {
          // For individual story requests, prepend the basePath to the slug
          const slug = extractSlugFromUrl(url);
          if (slug !== null && !slug.startsWith(config.basePath)) {
            // Join basePath and slug, handling potential double slashes
            const newSlug = joinPaths(config.basePath, slug);
            requestConfig.url = url.replace(
              `/stories/${slug}`,
              `/stories/${newSlug}`,
            );
          }
        } else {
          // Handle Stories and GetLinks API calls with starts_with parameter
          // Initialize params if not present
          if (!requestConfig.params) {
            requestConfig.params = {};
          }

          // Only add starts_with if it's not already present
          if (!requestConfig.params.starts_with) {
            requestConfig.params = {
              ...requestConfig.params,
              starts_with: config.basePath,
            };
          }
        }

        return requestConfig;
      },
      standardErrorHandler,
    );

    // Add response interceptor for link rewriting if enabled
    if (config.rewriteLinks) {
      axiosInstance.interceptors.response.use((response: AxiosResponse) => {
        // Only process Storyblok CDN responses
        if (!isStoryblokCdnResponse(response)) {
          return response;
        }

        // Process the response data to remove basePath from paths
        const processedData = removeBasePathFromResponse(
          response.data,
          config.basePath,
        );
        response.data = processedData;

        return response;
      }, standardErrorHandler);
    }
  };

/**
 * Type for Storyblok response data that might contain stories, links, or other data
 */
type StoryblokResponseData =
  | {
      story: StoryType<BlokType>;
      rels?: StoryType<BlokType>[];
      links?: StoryType<BlokType>[];
      [key: string]: unknown;
    }
  | {
      stories: StoryType<BlokType>[];
      rels?: StoryType<BlokType>[];
      links?: StoryType<BlokType>[];
      [key: string]: unknown;
    }
  | { links: Record<string, StoryblokLink>; [key: string]: unknown }
  | Record<string, unknown>;

/**
 * Removes basePath from response data paths and replaces with '/'
 */
function removeBasePathFromResponse(
  data: StoryblokResponseData,
  basePath: string,
): StoryblokResponseData {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // Handle single story response
  if ('story' in data && data.story) {
    const processedData: Record<string, unknown> = {
      ...data,
      story: processStoryRecursively(
        data.story as StoryType<BlokType>,
        basePath,
      ),
    };

    // Process rels array if present
    if ('rels' in data && Array.isArray(data.rels)) {
      processedData.rels = (data.rels as StoryType<BlokType>[]).map(
        (story: StoryType<BlokType>) =>
          processStoryRecursively(story, basePath),
      );
    }

    // Process links array if present (can be StoryblokLink[] or simplified story objects)
    if ('links' in data && Array.isArray(data.links)) {
      processedData.links = data.links.map((item: unknown) => {
        if (!item || typeof item !== 'object') {
          return item;
        }

        // Check if this is a StoryblokLink (has real_path property)
        if ('real_path' in item) {
          return removeBasePathFromLink(item as StoryblokLink, basePath);
        }
        // Check if this is a simplified story object (has full_slug but not all story properties)
        if ('full_slug' in item) {
          const typedItem = item as Record<string, unknown>;
          return {
            ...typedItem,
            full_slug: removeBasePathFromSlug(
              typedItem.full_slug as string,
              basePath.replace(/\/$/, ''),
            ),
            url: typedItem.url
              ? removeBasePathFromSlug(
                  typedItem.url as string,
                  basePath.replace(/\/$/, ''),
                )
              : typedItem.url,
          };
        }
        // If it's a full story object, process as story
        if (
          'id' in item &&
          'uuid' in item &&
          'slug' in item &&
          'content' in item
        ) {
          return processStoryRecursively(item as StoryType<BlokType>, basePath);
        }
        return item;
      });
    }

    return processedData;
  }

  // Handle multiple stories response
  if ('stories' in data && Array.isArray(data.stories)) {
    const processedData: Record<string, unknown> = {
      ...data,
      stories: (data.stories as StoryType<BlokType>[]).map(
        (story: StoryType<BlokType>) =>
          processStoryRecursively(story, basePath),
      ),
    };

    // Process rels array if present
    if ('rels' in data && Array.isArray(data.rels)) {
      processedData.rels = (data.rels as StoryType<BlokType>[]).map(
        (story: StoryType<BlokType>) =>
          processStoryRecursively(story, basePath),
      );
    }

    // Process links array if present (can be StoryblokLink[] or simplified story objects)
    if ('links' in data && Array.isArray(data.links)) {
      processedData.links = data.links.map((item: unknown) => {
        if (!item || typeof item !== 'object') {
          return item;
        }

        // Check if this is a StoryblokLink (has real_path property)
        if ('real_path' in item) {
          return removeBasePathFromLink(item as StoryblokLink, basePath);
        }
        // Check if this is a simplified story object
        if ('full_slug' in item) {
          const typedItem = item as Record<string, unknown>;
          return {
            ...typedItem,
            full_slug: removeBasePathFromSlug(
              typedItem.full_slug as string,
              basePath.replace(/\/$/, ''),
            ),
            url: typedItem.url
              ? removeBasePathFromSlug(
                  typedItem.url as string,
                  basePath.replace(/\/$/, ''),
                )
              : typedItem.url,
          };
        }
        // If it's a full story object, process as story
        if (
          'id' in item &&
          'uuid' in item &&
          'slug' in item &&
          'content' in item
        ) {
          return processStoryRecursively(item as StoryType<BlokType>, basePath);
        }
        return item;
      });
    }

    return processedData;
  }

  // Handle links response (Record<string, StoryblokLink>)
  if (
    'links' in data &&
    typeof data.links === 'object' &&
    !Array.isArray(data.links)
  ) {
    const processedData: Record<string, unknown> = { ...data };
    const linksObject = data.links as Record<string, StoryblokLink>;
    const processedLinks: Record<string, StoryblokLink> = {};

    Object.entries(linksObject).forEach(([key, link]) => {
      processedLinks[key] = removeBasePathFromLink(link, basePath);
    });

    processedData.links = processedLinks;
    return processedData;
  }

  return data;
}

/**
 * Processes a story object recursively to remove basePath from relevant fields
 */
function processStoryRecursively(
  story: StoryType<BlokType>,
  basePath: string,
): StoryType<BlokType> {
  const basePathWithoutSlash = basePath.replace(/\/$/, '');

  return {
    ...story,
    slug: removeBasePathFromSlug(story.slug, basePathWithoutSlash),
    full_slug: removeBasePathFromSlug(story.full_slug, basePathWithoutSlash),
    default_full_slug: story.default_full_slug
      ? removeBasePathFromSlug(story.default_full_slug, basePathWithoutSlash)
      : story.default_full_slug,
    alternates: story.alternates.map(
      (alternate: {
        id: number;
        name: string;
        slug: string;
        published: boolean;
        full_slug: string;
        is_folder: boolean;
        parent_id: number | null;
      }) => ({
        ...alternate,
        slug: removeBasePathFromSlug(alternate.slug, basePathWithoutSlash),
        full_slug: removeBasePathFromSlug(
          alternate.full_slug,
          basePathWithoutSlash,
        ),
      }),
    ),
    translated_slugs: story.translated_slugs.map(
      (translatedSlug: {
        path: string;
        name: string | null;
        lang: string;
      }) => ({
        ...translatedSlug,
        path: removeBasePathFromSlug(translatedSlug.path, basePathWithoutSlash),
      }),
    ),
    content: processContentRecursively(
      story.content as unknown as Record<string, unknown>,
      basePath,
    ) as unknown as BlokType,
  };
}

/**
 * Processes story content recursively to remove basePath from any URL-like fields
 */
function processContentRecursively(
  content: Record<string, unknown>,
  basePath: string,
): Record<string, unknown> {
  const basePathWithoutSlash = basePath.replace(/\/$/, '');
  const processed: Record<string, unknown> = {};

  Object.entries(content).forEach(([key, value]) => {
    if (typeof value === 'string' && value.startsWith(basePathWithoutSlash)) {
      // If it looks like a path that starts with our basePath, remove it
      processed[key] = removeBasePathFromSlug(value, basePathWithoutSlash);
    } else if (Array.isArray(value)) {
      // Process arrays recursively
      processed[key] = value.map((item) => {
        if (typeof item === 'string' && item.startsWith(basePathWithoutSlash)) {
          return removeBasePathFromSlug(item, basePathWithoutSlash);
        }
        if (item && typeof item === 'object') {
          return processContentRecursively(
            item as Record<string, unknown>,
            basePath,
          );
        }
        return item;
      });
    } else if (value && typeof value === 'object') {
      // Process nested objects recursively
      processed[key] = processContentRecursively(
        value as Record<string, unknown>,
        basePath,
      );
    } else {
      processed[key] = value;
    }
  });

  return processed;
}

/**
 * Removes basePath from a StoryblokLink object
 */
function removeBasePathFromLink(
  link: StoryblokLink,
  basePath: string,
): StoryblokLink {
  const basePathWithoutSlash = basePath.replace(/\/$/, '');

  return {
    ...link,
    slug: removeBasePathFromSlug(link.slug, basePathWithoutSlash),
    path: link.path
      ? removeBasePathFromSlug(link.path, basePathWithoutSlash)
      : link.path,
    real_path: removeBasePathFromSlug(link.real_path, basePathWithoutSlash),
    alternates: link.alternates
      ? link.alternates.map((alternate) => ({
          ...alternate,
          path: removeBasePathFromSlug(alternate.path, basePathWithoutSlash),
          translated_slug: removeBasePathFromSlug(
            alternate.translated_slug,
            basePathWithoutSlash,
          ),
        }))
      : link.alternates,
  };
}

/**
 * Removes basePath from a slug/path string
 */
function removeBasePathFromSlug(
  slug: string,
  basePathWithoutSlash: string,
): string {
  if (slug.startsWith(basePathWithoutSlash)) {
    const remaining = slug.substring(basePathWithoutSlash.length);
    // If what remains starts with a slash, keep it; otherwise add one
    return remaining.startsWith('/') ? remaining : `/${remaining}`;
  }
  return slug;
}
