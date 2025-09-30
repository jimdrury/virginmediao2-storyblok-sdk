import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * Standard error handler for axios interceptors
 */
export const standardErrorHandler = (error: unknown) => Promise.reject(error);

/**
 * Checks if the request is to a Storyblok CDN endpoint
 * This is the most comprehensive version that checks baseURL and URL patterns
 */
export function isStoryblokCdnRequest(
  config: InternalAxiosRequestConfig,
): boolean {
  const baseURL = config.baseURL || '';
  const url = config.url || '';

  // Check if it's a Storyblok CDN URL
  return (
    baseURL.includes('api.storyblok.com') ||
    baseURL.includes('cdn') ||
    url.includes('/stories') ||
    url.includes('/links')
  );
}

/**
 * Checks if the response is from a Storyblok CDN endpoint
 */
export function isStoryblokCdnResponse(response: AxiosResponse): boolean {
  return isStoryblokCdnRequest(response.config);
}

/**
 * Checks if the request is to Stories or GetLinks API endpoints
 */
export function isStoriesOrLinksRequest(
  config: InternalAxiosRequestConfig,
): boolean {
  const url = config.url || '';
  return url.includes('/stories') || url.includes('/links');
}

/**
 * Checks if this is an individual story request (e.g., /stories/my-slug or /stories/)
 * Distinguished from collection requests (/stories)
 */
export function isIndividualStoryRequest(url: string): boolean {
  // Match pattern: /stories/{slug} or /stories/ (for root story) but not just /stories
  const storyPattern = /^\/stories\/([^/?]*(\?.*)?|$)/;
  return storyPattern.test(url) && url !== '/stories';
}

/**
 * Extracts the slug from a story URL
 * Returns empty string for root stories (/stories/), null for invalid URLs
 */
export function extractSlugFromUrl(url: string): string | null {
  const match = url.match(/^\/stories\/([^?]*)/);
  return match ? match[1].replace(/\/$/, '') : null; // Remove trailing slash from extracted slug
}

/**
 * Joins two path segments, handling double slashes and empty segments
 */
export function joinPaths(basePath: string, slug: string): string {
  // Remove trailing slashes from basePath if present
  const cleanBasePath = basePath.replace(/\/+$/, '');
  // Remove leading slashes from slug if present
  const cleanSlug = slug.replace(/^\/+/, '');

  return `${cleanBasePath}/${cleanSlug}`;
}

/**
 * Safely initializes request params if not present
 */
export function ensureRequestParams(config: InternalAxiosRequestConfig): void {
  if (!config.params) {
    config.params = {};
  }
}

/**
 * Adds a parameter to request config if not already present
 */
export function addParamIfNotPresent(
  config: InternalAxiosRequestConfig,
  key: string,
  value: unknown,
): void {
  ensureRequestParams(config);

  if (!config.params[key]) {
    config.params = {
      ...config.params,
      [key]: value,
    };
  }
}
