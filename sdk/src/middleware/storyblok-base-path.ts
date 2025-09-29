import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export interface StoryblokBasePathConfig {
  /**
   * The base path to automatically append to starts_with parameter
   * for Stories and GetLinks API calls
   */
  basePath: `${string}/`;
}

/**
 * Factory function that creates a Storyblok base path middleware
 *
 * This middleware automatically handles base path configuration for Storyblok API calls:
 * - For Stories and GetLinks API calls: appends a `starts_with` query parameter with the configured base path
 * - For individual story requests: prepends the base path to the story slug in the URL
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
 *   basePath: "blog/"
 * });
 *
 * // Apply to axios instance
 * basePathMiddleware(axiosInstance);
 *
 * // This will automatically:
 * // - Add starts_with=blog/ to /stories and /links requests
 * // - Transform /stories/my-article to /stories/blog/my-article
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
