import type { AxiosInstance } from 'axios';

/**
 * Add access token interceptor for Storyblok Content Delivery API
 * Automatically adds the token parameter to all requests
 *
 * @param axiosInstance - The axios instance to add the interceptor to
 * @param accessToken - The Storyblok access token
 */
export function addAccessTokenInterceptor(
  axiosInstance: AxiosInstance,
  accessToken: string,
) {
  axiosInstance.interceptors.request.use(
    (config) => {
      config.params = {
        ...config.params,
        token: accessToken,
      };
      return config;
    },
    (error) => Promise.reject(error),
  );
}
