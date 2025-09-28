import type { AxiosInstance } from 'axios';
import type { StoryblokRetryOptions } from '../types';

/**
 * Add exponential backoff retry interceptor for 429 errors to an axios instance
 * Always retries on 429 (Too Many Requests) errors with exponential backoff until maxDelay is reached
 *
 * @param axiosInstance - The axios instance to add the interceptor to
 * @param retryOptions - Configuration options for retry behavior
 */
export function addRetryInterceptor(
  axiosInstance: AxiosInstance,
  retryOptions: StoryblokRetryOptions = {},
) {
  const baseDelay = retryOptions.baseDelay || 50;
  const maxDelay = retryOptions.maxDelay || 2000;

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Only retry on 429 (Too Many Requests) errors
      if (error.response?.status !== 429) {
        return Promise.reject(error);
      }

      const config = error.config;

      // Initialize retry count if not present
      if (!config.__retryCount) {
        config.__retryCount = 0;
      }

      // Calculate exponential backoff delay
      const delay = Math.min(baseDelay * 2 ** config.__retryCount, maxDelay);

      // Check if we should retry (only if delay hasn't reached max)
      if (delay < maxDelay) {
        config.__retryCount++;

        // Add jitter to prevent thundering herd (10% of delay)
        const jitter = delay * 0.1 * Math.random();
        const jitteredDelay = delay + jitter;

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, jitteredDelay));

        // Retry the request
        return axiosInstance.request(config);
      }

      // If we've reached max delay, stop retrying
      return Promise.reject(error);
    },
  );
}
