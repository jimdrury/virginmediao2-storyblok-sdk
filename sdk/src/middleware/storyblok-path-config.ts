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
   * The folder path within Storyblok to automatically append to starts_with parameter
   * for Stories and GetLinks API calls
   */
  folderPath: `${string}/`;
  /**
   * Whether to rewrite response data by removing the folderPath from story paths
   * This WILL mutate the Storyblok response
   * @default false
   */
  rewriteLinks?: boolean;
  /**
   * The HTML/application basePath (e.g., Next.js basePath) to strip from hrefs in link objects
   * This is useful when Storyblok returns links with the application basePath prepended,
   * but your framework (like Next.js) automatically adds it, causing duplication.
   * Only applied when rewriteLinks is true.
   * @example "my-app" - will strip "/my-app" from "/my-app/page" to get "/page"
   */
  htmlBasePath?: `/${string}`;
}

/**
 * Factory function that creates a Storyblok path configuration middleware
 *
 * This middleware automatically handles folder path configuration for Storyblok API calls:
 * - For Stories and GetLinks API calls: appends a `starts_with` query parameter with the configured folder path
 * - For individual story requests: prepends the folder path to the story slug in the URL
 * - Optionally removes the folderPath from response data paths when `rewriteLinks` is enabled
 * - Optionally removes the htmlBasePath from href fields in link objects when `rewriteLinks` is enabled
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
 *   folderPath: "docs/",
 *   rewriteLinks: true, // Optional: rewrite response paths
 *   htmlBasePath: "my-app" // Optional: strip app basePath from hrefs
 * });
 *
 * // Apply to axios instance
 * pathMiddleware(axiosInstance);
 *
 * // This will automatically:
 * // - Add starts_with=docs/ to /stories and /links requests
 * // - Transform /stories/my-article to /stories/docs/my-article
 * // - If rewriteLinks=true: Remove "docs/" from response paths: "docs/my-article" -> "/my-article"
 * // - If htmlBasePath set: Remove "/my-app" from hrefs: "/my-app/page" -> "/page"
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
          // For individual story requests, prepend the folderPath to the slug
          const slug = extractSlugFromUrl(url);
          if (slug !== null && !slug.startsWith(config.folderPath)) {
            // Join folderPath and slug, handling potential double slashes
            const newSlug = joinPaths(config.folderPath, slug);
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
              starts_with: config.folderPath,
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

        // Process the response data to remove folderPath from paths
        const processedData = removeFolderPathFromResponse(
          response.data,
          config.folderPath,
          config.htmlBasePath,
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
 * Removes folderPath from response data paths and replaces with '/'
 * Optionally removes htmlBasePath from href fields in link objects
 */
function removeFolderPathFromResponse(
  data: StoryblokResponseData,
  folderPath: string,
  htmlBasePath?: string,
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
        folderPath,
        htmlBasePath,
      ),
    };

    // Process rels array if present
    if ('rels' in data && Array.isArray(data.rels)) {
      processedData.rels = (data.rels as StoryType<BlokType>[]).map(
        (story: StoryType<BlokType>) =>
          processStoryRecursively(story, folderPath, htmlBasePath),
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
          return removeFolderPathFromLink(item as StoryblokLink, folderPath);
        }
        // Check if this is a simplified story object (has full_slug but not all story properties)
        if ('full_slug' in item) {
          const typedItem = item as Record<string, unknown>;
          return {
            ...typedItem,
            full_slug: removeFolderPathFromSlug(
              typedItem.full_slug as string,
              folderPath.replace(/\/$/, ''),
            ),
            url: typedItem.url
              ? removeFolderPathFromSlug(
                  typedItem.url as string,
                  folderPath.replace(/\/$/, ''),
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
          return processStoryRecursively(
            item as StoryType<BlokType>,
            folderPath,
            htmlBasePath,
          );
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
          processStoryRecursively(story, folderPath, htmlBasePath),
      ),
    };

    // Process rels array if present
    if ('rels' in data && Array.isArray(data.rels)) {
      processedData.rels = (data.rels as StoryType<BlokType>[]).map(
        (story: StoryType<BlokType>) =>
          processStoryRecursively(story, folderPath, htmlBasePath),
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
          return removeFolderPathFromLink(item as StoryblokLink, folderPath);
        }
        // Check if this is a simplified story object
        if ('full_slug' in item) {
          const typedItem = item as Record<string, unknown>;
          return {
            ...typedItem,
            full_slug: removeFolderPathFromSlug(
              typedItem.full_slug as string,
              folderPath.replace(/\/$/, ''),
            ),
            url: typedItem.url
              ? removeFolderPathFromSlug(
                  typedItem.url as string,
                  folderPath.replace(/\/$/, ''),
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
          return processStoryRecursively(
            item as StoryType<BlokType>,
            folderPath,
            htmlBasePath,
          );
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
      processedLinks[key] = removeFolderPathFromLink(link, folderPath);
    });

    processedData.links = processedLinks;
    return processedData;
  }

  return data;
}

/**
 * Processes a story object recursively to remove folderPath from relevant fields
 * and optionally removes htmlBasePath from href fields in link objects
 */
function processStoryRecursively(
  story: StoryType<BlokType>,
  folderPath: string,
  htmlBasePath?: string,
): StoryType<BlokType> {
  const folderPathWithoutSlash = folderPath.replace(/\/$/, '');

  return {
    ...story,
    slug: removeFolderPathFromSlug(story.slug, folderPathWithoutSlash),
    full_slug: removeFolderPathFromSlug(
      story.full_slug,
      folderPathWithoutSlash,
    ),
    default_full_slug: story.default_full_slug
      ? removeFolderPathFromSlug(
          story.default_full_slug,
          folderPathWithoutSlash,
        )
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
        slug: removeFolderPathFromSlug(alternate.slug, folderPathWithoutSlash),
        full_slug: removeFolderPathFromSlug(
          alternate.full_slug,
          folderPathWithoutSlash,
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
        path: removeFolderPathFromSlug(
          translatedSlug.path,
          folderPathWithoutSlash,
        ),
      }),
    ),
    content: processContentRecursively(
      story.content as unknown as Record<string, unknown>,
      folderPath,
      htmlBasePath,
    ) as unknown as BlokType,
  };
}

/**
 * Processes story content recursively to remove folderPath from any URL-like fields
 * and optionally removes htmlBasePath from href fields in link objects
 */
function processContentRecursively(
  content: Record<string, unknown>,
  folderPath: string,
  htmlBasePath?: string,
): Record<string, unknown> {
  const folderPathWithoutSlash = folderPath.replace(/\/$/, '');
  const processed: Record<string, unknown> = {};

  Object.entries(content).forEach(([key, value]) => {
    // Special handling for href field with htmlBasePath
    if (key === 'href' && typeof value === 'string' && htmlBasePath) {
      const normalizedHtmlBasePath = `/${htmlBasePath.replace(/^\/+|\/+$/g, '')}`;
      if (value.startsWith(normalizedHtmlBasePath)) {
        processed[key] = value.substring(normalizedHtmlBasePath.length) || '/';
      } else {
        processed[key] = value;
      }
    } else if (
      typeof value === 'string' &&
      value.startsWith(folderPathWithoutSlash)
    ) {
      // If it looks like a path that starts with our folderPath, remove it
      processed[key] = removeFolderPathFromSlug(value, folderPathWithoutSlash);
    } else if (Array.isArray(value)) {
      // Process arrays recursively
      processed[key] = value.map((item) => {
        if (
          typeof item === 'string' &&
          item.startsWith(folderPathWithoutSlash)
        ) {
          return removeFolderPathFromSlug(item, folderPathWithoutSlash);
        }
        if (item && typeof item === 'object') {
          return processContentRecursively(
            item as Record<string, unknown>,
            folderPath,
            htmlBasePath,
          );
        }
        return item;
      });
    } else if (value && typeof value === 'object') {
      // Process nested objects recursively
      processed[key] = processContentRecursively(
        value as Record<string, unknown>,
        folderPath,
        htmlBasePath,
      );
    } else {
      processed[key] = value;
    }
  });

  return processed;
}

/**
 * Removes folderPath from a StoryblokLink object
 */
function removeFolderPathFromLink(
  link: StoryblokLink,
  folderPath: string,
): StoryblokLink {
  const folderPathWithoutSlash = folderPath.replace(/\/$/, '');

  return {
    ...link,
    slug: removeFolderPathFromSlug(link.slug, folderPathWithoutSlash),
    path: link.path
      ? removeFolderPathFromSlug(link.path, folderPathWithoutSlash)
      : link.path,
    real_path: removeFolderPathFromSlug(link.real_path, folderPathWithoutSlash),
    alternates: link.alternates
      ? link.alternates.map((alternate) => ({
          ...alternate,
          path: removeFolderPathFromSlug(
            alternate.path,
            folderPathWithoutSlash,
          ),
          translated_slug: removeFolderPathFromSlug(
            alternate.translated_slug,
            folderPathWithoutSlash,
          ),
        }))
      : link.alternates,
  };
}

/**
 * Removes folderPath from a slug/path string
 */
function removeFolderPathFromSlug(
  slug: string,
  folderPathWithoutSlash: string,
): string {
  if (slug.startsWith(folderPathWithoutSlash)) {
    const remaining = slug.substring(folderPathWithoutSlash.length);
    // If what remains starts with a slash, keep it; otherwise add one
    return remaining.startsWith('/') ? remaining : `/${remaining}`;
  }
  return slug;
}
