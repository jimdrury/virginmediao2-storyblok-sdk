import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import type { StoryblokLink, StoryblokStory } from '../types';

export interface StoryblokBasePathConfig {
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
 * Factory function that creates a Storyblok base path middleware
 *
 * This middleware automatically handles base path configuration for Storyblok API calls:
 * - For Stories and GetLinks API calls: appends a `starts_with` query parameter with the configured base path
 * - For individual story requests: prepends the base path to the story slug in the URL
 * - Optionally removes the basePath from response data paths when `rewriteLinks` is enabled
 * If a `starts_with` parameter is already present, it will be left unchanged.
 *
 * @param config - Configuration for the base path middleware
 * @returns A middleware function that can be applied to an AxiosInstance
 *
 * @example
 * ```typescript
 * import { storyblokBasePath } from "@virginmediao2/storyblok-sdk";
 *
 * const basePathMiddleware = storyblokBasePath({
 *   basePath: "blog/",
 *   rewriteLinks: true // Optional: rewrite response paths
 * });
 *
 * // Apply to axios instance
 * basePathMiddleware(axiosInstance);
 *
 * // This will automatically:
 * // - Add starts_with=blog/ to /stories and /links requests
 * // - Transform /stories/my-article to /stories/blog/my-article
 * // - If rewriteLinks=true: Remove "blog/" from response paths: "blog/my-article" -> "/my-article"
 * ```
 */
export const storyblokBasePath =
  (config: StoryblokBasePathConfig) =>
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
          if (slug && !slug.startsWith(config.basePath)) {
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
      (error) => Promise.reject(error),
    );

    // Add response interceptor to remove basePath from response data (if enabled)
    if (config.rewriteLinks) {
      axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => {
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
        },
        (error) => Promise.reject(error),
      );
    }
  };

/**
 * Checks if the request is to a Storyblok CDN endpoint
 */
function isStoryblokCdnRequest(config: InternalAxiosRequestConfig): boolean {
  const url = config.url || '';
  return url.includes('/stories') || url.includes('/links');
}

/**
 * Checks if the request is to Stories, GetLinks API endpoints, or individual story endpoints
 */
function isStoriesOrLinksRequest(config: InternalAxiosRequestConfig): boolean {
  const url = config.url || '';

  // Check for Stories API endpoints (both /stories and /stories/{slug})
  if (url.includes('/stories')) {
    return true;
  }

  // Check for GetLinks API endpoints
  if (url.includes('/links')) {
    return true;
  }

  return false;
}

/**
 * Checks if the request is to an individual story endpoint (e.g., /stories/some-slug)
 */
function isIndividualStoryRequest(url: string): boolean {
  // Use glob pattern matching: /stories/* (but not /stories itself)
  return url.startsWith('/stories/') && url !== '/stories';
}

/**
 * Extracts the slug from a story URL
 */
function extractSlugFromUrl(url: string): string | null {
  if (!isIndividualStoryRequest(url)) {
    return null;
  }

  // Remove query parameters and extract slug
  const urlWithoutQuery = url.split('?')[0];
  const slug = urlWithoutQuery.replace('/stories/', '');
  return slug || null;
}

/**
 * Joins two path segments, handling double slashes and ensuring proper path structure
 */
function joinPaths(basePath: string, slug: string): string {
  // Remove trailing slash from basePath and leading slash from slug
  const cleanBasePath = basePath.replace(/\/$/, '');
  const cleanSlug = slug.replace(/^\//, '');

  // Join with a single slash
  return `${cleanBasePath}/${cleanSlug}`;
}

/**
 * Checks if the response is from a Storyblok CDN endpoint
 */
function isStoryblokCdnResponse(response: AxiosResponse): boolean {
  const config = response.config;
  const url = config.url || '';
  return url.includes('/stories') || url.includes('/links');
}

/**
 * Type for Storyblok API response data
 */
type StoryblokResponseData =
  | {
      story: StoryblokStory;
      rels?: StoryblokStory[];
      links?: StoryblokStory[];
      [key: string]: unknown;
    }
  | {
      stories: StoryblokStory[];
      rels?: StoryblokStory[];
      links?: StoryblokStory[];
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
      story: processStoryRecursively(data.story as StoryblokStory, basePath),
    };

    // Process rels array if present
    if ('rels' in data && Array.isArray(data.rels)) {
      processedData.rels = (data.rels as StoryblokStory[]).map(
        (story: StoryblokStory) => processStoryRecursively(story, basePath),
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
          return processStoryRecursively(item as StoryblokStory, basePath);
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
      stories: (data.stories as StoryblokStory[]).map((story: StoryblokStory) =>
        processStoryRecursively(story, basePath),
      ),
    };

    // Process rels array if present
    if ('rels' in data && Array.isArray(data.rels)) {
      processedData.rels = (data.rels as StoryblokStory[]).map(
        (story: StoryblokStory) => processStoryRecursively(story, basePath),
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
          return processStoryRecursively(item as StoryblokStory, basePath);
        }
        return item;
      });
    }

    return processedData;
  }

  // Handle links response
  if ('links' in data && data.links) {
    const processedLinks: Record<string, StoryblokLink> = {};
    for (const [key, link] of Object.entries(data.links)) {
      processedLinks[key] = removeBasePathFromLink(
        link as StoryblokLink,
        basePath,
      );
    }
    return {
      ...data,
      links: processedLinks,
    };
  }

  return data;
}

/**
 * Processes a story by removing basePath from its path fields
 * Note: Nested story objects in content are handled by storyblokLinksResolver
 */
function processStoryRecursively(
  story: StoryblokStory,
  basePath: string,
): StoryblokStory {
  return removeBasePathFromStory(story, basePath);
}

/**
 * Removes basePath from a single story's path fields
 */
function removeBasePathFromStory(
  story: StoryblokStory,
  basePath: string,
): StoryblokStory {
  const cleanBasePath = basePath.replace(/\/$/, ''); // Remove trailing slash

  return {
    ...story,
    slug: removeBasePathFromSlug(story.slug, cleanBasePath),
    full_slug: removeBasePathFromSlug(story.full_slug, cleanBasePath),
    alternates: story.alternates?.map((alternate) => ({
      ...alternate,
      slug: removeBasePathFromSlug(alternate.slug, cleanBasePath),
      full_slug: removeBasePathFromSlug(alternate.full_slug, cleanBasePath),
    })),
    translated_slugs: story.translated_slugs?.map((translatedSlug) => ({
      ...translatedSlug,
      path: removeBasePathFromSlug(translatedSlug.path, cleanBasePath),
    })),
    default_full_slug: story.default_full_slug
      ? removeBasePathFromSlug(story.default_full_slug, cleanBasePath)
      : story.default_full_slug,
  };
}

/**
 * Removes basePath from a single link's path fields
 */
function removeBasePathFromLink(
  link: StoryblokLink,
  basePath: string,
): StoryblokLink {
  const cleanBasePath = basePath.replace(/\/$/, ''); // Remove trailing slash

  return {
    ...link,
    slug: removeBasePathFromSlug(link.slug, cleanBasePath),
    path: link.path
      ? removeBasePathFromSlug(link.path, cleanBasePath)
      : link.path,
    real_path: removeBasePathFromSlug(link.real_path, cleanBasePath),
    alternates: link.alternates?.map((alternate) => ({
      ...alternate,
      path: removeBasePathFromSlug(alternate.path, cleanBasePath),
      translated_slug: removeBasePathFromSlug(
        alternate.translated_slug,
        cleanBasePath,
      ),
    })),
  };
}

/**
 * Removes basePath from a slug/path string and replaces with '/'
 */
function removeBasePathFromSlug(slug: string, basePath: string): string {
  if (!slug || !basePath) {
    return slug;
  }

  // Clean the basePath by removing trailing slash for comparison
  const cleanBasePath = basePath.replace(/\/$/, '');

  // Check if the slug starts with the basePath (with or without trailing slash)
  if (slug === cleanBasePath || slug.startsWith(`${cleanBasePath}/`)) {
    if (slug === cleanBasePath) {
      // If slug exactly matches basePath, return '/'
      return '/';
    }
    // If slug starts with basePath + '/', remove the basePath part and keep the '/'
    const remainingPath = slug.substring(cleanBasePath.length);
    return remainingPath.startsWith('/') ? remainingPath : `/${remainingPath}`;
  }

  return slug;
}
