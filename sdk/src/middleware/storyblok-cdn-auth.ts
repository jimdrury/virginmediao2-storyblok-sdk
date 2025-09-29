import type { AxiosInstance } from 'axios';

/**
 * Configuration interface for the Storyblok CDN auth middleware
 */
export interface StoryblokCdnAuthConfig {
  /**
   * The Storyblok access token to append to requests
   */
  accessToken: string;
}

/**
 * Factory function that creates a Storyblok CDN auth middleware
 *
 * @param config - Configuration for the CDN auth middleware
 * @returns A middleware function that can be applied to an AxiosInstance
 *
 * @example
 * ```typescript
 * import { storyblokCdnAuth } from "@virginmediao2/storyblok-sdk";
 *
 * const authMiddleware = storyblokCdnAuth({
 *   accessToken: "your-access-token"
 * });
 *
 * // Apply to axios instance
 * authMiddleware(axiosInstance);
 * ```
 */
export const storyblokCdnAuth =
  (config: StoryblokCdnAuthConfig) =>
  (axiosInstance: AxiosInstance): void => {
    axiosInstance.interceptors.request.use(
      (requestConfig) => {
        if (!requestConfig.params) {
          requestConfig.params = {};
        }

        if (!requestConfig.params.token) {
          requestConfig.params = {
            ...requestConfig.params,
            token: config.accessToken,
          };
        }

        return requestConfig;
      },
      (error) => Promise.reject(error),
    );
  };
