import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  addParamIfNotPresent,
  isStoryblokCdnResponse,
  standardErrorHandler,
} from './shared-utils';

export interface StoryblokCdnConfigOptions {
  /**
   * Access token for Storyblok CDN API (required)
   */
  accessToken: string;
  /**
   * Custom domain to replace a.storyblok.com for assets (optional)
   * When provided, enables automatic asset URL replacement
   * @example "https://assets.example.com"
   */
  assetDomain?: `https://${string}`;
  /**
   * Optional array of allowed space IDs. Only works when assetDomain is provided.
   * If provided, only URLs containing these space IDs will be processed.
   * URLs with space IDs not in this list will be set to empty string.
   * @example ["329767", "123456"]
   */
  allowedSpaceIds?: `${number}`[];
}

/**
 * Factory function that creates a unified Storyblok CDN configuration middleware
 *
 * This middleware combines CDN authentication and asset domain replacement functionality:
 * - Always adds the access token to all requests as a query parameter
 * - Optionally replaces a.storyblok.com asset URLs with a custom domain (when assetDomain is provided)
 * - Optionally filters URLs based on space IDs (when allowedSpaceIds is provided with assetDomain)
 *
 * @param config - Configuration for the CDN middleware
 * @param config.accessToken - Required access token for authentication
 * @param config.assetDomain - Optional custom domain for assets
 * @param config.allowedSpaceIds - Optional array of allowed space IDs (requires assetDomain)
 * @returns A middleware function that can be applied to an AxiosInstance
 *
 * @example
 * ```typescript
 * import { storyblokCdnConfig } from "@virginmediao2/storyblok-sdk";
 *
 * // Basic usage - authentication only
 * const basicMiddleware = storyblokCdnConfig({
 *   accessToken: "your-access-token"
 * });
 *
 * // With custom asset domain
 * const assetMiddleware = storyblokCdnConfig({
 *   accessToken: "your-access-token",
 *   assetDomain: "https://assets.example.com"
 * });
 *
 * // Multi-tenant with space filtering
 * const multiTenantMiddleware = storyblokCdnConfig({
 *   accessToken: "your-access-token",
 *   assetDomain: "https://cdn.myapp.com",
 *   allowedSpaceIds: ["329767", "123456"]
 * });
 *
 * // Apply to axios instance
 * basicMiddleware(axiosInstance);
 * ```
 */
export const storyblokCdnConfig =
  (config: StoryblokCdnConfigOptions) =>
  (axiosInstance: AxiosInstance): void => {
    // Add request interceptor for authentication
    axiosInstance.interceptors.request.use(
      (requestConfig: InternalAxiosRequestConfig) => {
        // Add access token if not already present
        addParamIfNotPresent(requestConfig, 'token', config.accessToken);
        return requestConfig;
      },
      standardErrorHandler,
    );

    // Add response interceptor for asset domain replacement (if configured)
    if (config.assetDomain) {
      const assetDomain = config.assetDomain; // Type guard for closure
      axiosInstance.interceptors.response.use((response: AxiosResponse) => {
        if (!isStoryblokCdnResponse(response)) {
          return response;
        }

        // Process the response data to replace asset URLs
        const processedData = processAssetUrls(
          response.data,
          assetDomain,
          config.allowedSpaceIds,
        );
        response.data = processedData;

        return response;
      }, standardErrorHandler);
    }
  };

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
