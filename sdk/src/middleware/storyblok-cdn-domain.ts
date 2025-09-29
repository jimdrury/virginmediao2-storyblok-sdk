import type { AxiosInstance, AxiosResponse } from 'axios';

export interface StoryblokCdnDomainConfig {
  /**
   * Custom domain to replace a.storyblok.com for assets
   * @example "https://assets.example.com"
   */
  assetDomain: `https://${string}`;
  /**
   * Optional array of allowed space IDs. If provided, only URLs containing these space IDs will be processed.
   * URLs with space IDs not in this list will be set to empty string.
   * @example ["329767", "123456"]
   */
  allowedSpaceIds?: `${number}`[];
}

/**
 * Factory function that creates a Storyblok CDN domain middleware
 *
 * This middleware automatically replaces a.storyblok.com asset URLs with a custom domain
 * in response data. It processes all string fields in the response that contain asset URLs.
 * Optionally filters URLs based on space IDs.
 *
 * @param config - Configuration for the CDN domain middleware
 * @param config.assetDomain - Custom domain to use for assets
 * @param config.allowedSpaceIds - Optional array of allowed space IDs for filtering
 * @returns A middleware function that can be applied to an AxiosInstance
 *
 * @example
 * ```typescript
 * import { storyblokCdnDomain } from "@virginmediao2/storyblok-sdk";
 *
 * const cdnDomainMiddleware = storyblokCdnDomain({
 *   assetDomain: "https://assets.example.com",
 *   allowedSpaceIds: ["329767", "123456"]
 * });
 *
 * // Apply to axios instance
 * cdnDomainMiddleware(axiosInstance);
 *
 * // This will automatically replace:
 * // https://a.storyblok.com/f/329767/image.jpg -> https://assets.example.com/f/329767/image.jpg
 * // Asset objects with blocked URLs will be replaced with empty asset structure
 * ```
 */
export const storyblokCdnDomain =
  (config: StoryblokCdnDomainConfig) =>
  (axiosInstance: AxiosInstance): void => {
    axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (!isStoryblokCdnResponse(response)) {
          return response;
        }

        // Process the response data to replace asset URLs
        const processedData = processAssetUrls(
          response.data,
          config.assetDomain,
          config.allowedSpaceIds,
        );
        response.data = processedData;

        return response;
      },
      (error) => Promise.reject(error),
    );
  };

/**
 * Checks if the response is from a Storyblok CDN endpoint
 */
function isStoryblokCdnResponse(response: AxiosResponse): boolean {
  const config = response.config;
  const url = config.url || '';
  return url.includes('/stories') || url.includes('/links');
}

/**
 * Recursively processes an object to replace asset URLs
 */
function processAssetUrls(
  obj: unknown,
  assetDomain: string,
  allowedSpaceIds?: string[],
): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return replaceAssetUrl(obj, assetDomain, allowedSpaceIds);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) =>
      processAssetUrls(item, assetDomain, allowedSpaceIds),
    );
  }

  if (typeof obj === 'object') {
    const processed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Special handling for asset objects - only process the filename field
      if (
        isAssetObject(obj) &&
        key === 'filename' &&
        typeof value === 'string'
      ) {
        const processedUrl = replaceAssetUrl(
          value,
          assetDomain,
          allowedSpaceIds,
        );
        if (processedUrl === '') {
          // If URL is blocked, replace the entire asset object with empty structure
          return createEmptyAssetObject();
        }
        processed[key] = processedUrl;
      } else {
        processed[key] = processAssetUrls(value, assetDomain, allowedSpaceIds);
      }
    }
    return processed;
  }

  return obj;
}

/**
 * Checks if an object is a Storyblok asset object
 */
function isAssetObject(obj: unknown): boolean {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const assetObj = obj as Record<string, unknown>;
  return (
    'fieldtype' in assetObj &&
    assetObj.fieldtype === 'asset' &&
    'filename' in assetObj
  );
}

/**
 * Replaces a.storyblok.com URLs with the custom asset domain
 * Optionally filters by space ID
 */
function replaceAssetUrl(
  url: string,
  assetDomain: string,
  allowedSpaceIds?: string[],
): string {
  // Match a.storyblok.com URLs (with or without protocol)
  const storyblokAssetRegex = /https?:\/\/a\.storyblok\.com/g;

  if (storyblokAssetRegex.test(url)) {
    // If space ID filtering is enabled, check if the URL contains an allowed space ID
    if (allowedSpaceIds && allowedSpaceIds.length > 0) {
      const spaceId = extractSpaceIdFromUrl(url);
      if (!spaceId || !allowedSpaceIds.includes(spaceId)) {
        return '';
      }
    }

    return url.replace(storyblokAssetRegex, assetDomain);
  }

  return url;
}

/**
 * Creates an empty asset object structure for blocked/invalid URLs
 */
function createEmptyAssetObject() {
  return {
    id: null,
    alt: null,
    name: '',
    focus: null,
    title: null,
    filename: null,
    copyright: null,
    fieldtype: 'asset',
    meta_data: {},
    is_external_url: false,
    source: null,
  };
}

/**
 * Extracts space ID from a Storyblok asset URL
 * URL format: https://a.storyblok.com/f/{spaceId}/...
 */
function extractSpaceIdFromUrl(url: string): string | null {
  const spaceIdMatch = url.match(/\/f\/(\d+)\//);
  return spaceIdMatch ? spaceIdMatch[1] : null;
}
