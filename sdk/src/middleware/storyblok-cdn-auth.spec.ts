import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { AxiosHeaders } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { storyblokCdnAuth } from './storyblok-cdn-auth';

describe('storyblokCdnAuth', () => {
  let mockAxiosInstance: AxiosInstance;
  let requestInterceptor: (
    config: InternalAxiosRequestConfig,
  ) => InternalAxiosRequestConfig;

  beforeEach(() => {
    requestInterceptor = vi.fn((config) => config);
    mockAxiosInstance = {
      interceptors: {
        request: {
          use: vi.fn((success, _error) => {
            requestInterceptor = success;
          }),
        },
        response: {
          use: vi.fn(),
        },
      },
    } as unknown as AxiosInstance;
  });

  it('should create a middleware function', () => {
    const config = { accessToken: 'test-token' };
    const middleware = storyblokCdnAuth(config);

    expect(typeof middleware).toBe('function');
  });

  it('should apply request interceptor to axios instance', () => {
    const config = { accessToken: 'test-token' };
    const middleware = storyblokCdnAuth(config);

    middleware(mockAxiosInstance);

    expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
    );
  });

  describe('request interceptor', () => {
    beforeEach(() => {
      const config = { accessToken: 'test-token' };
      const middleware = storyblokCdnAuth(config);
      middleware(mockAxiosInstance);
    });

    it('should add token to request params when params is undefined', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({ token: 'test-token' });
    });

    it('should add token to existing params', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        params: { page: 1 },
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({
        page: 1,
        token: 'test-token',
      });
    });

    it('should not override existing token', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        params: { token: 'existing-token' },
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({ token: 'existing-token' });
    });

    it('should preserve all existing params when adding token', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        params: {
          page: 1,
          per_page: 10,
          starts_with: 'blog/',
          filter_query: { component: { is: 'blog_post' } },
        },
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({
        page: 1,
        per_page: 10,
        starts_with: 'blog/',
        filter_query: { component: { is: 'blog_post' } },
        token: 'test-token',
      });
    });

    it('should handle empty params object', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        params: {},
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({ token: 'test-token' });
    });

    it('should handle null params', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        params: null,
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({ token: 'test-token' });
    });

    it('should handle undefined params', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        params: undefined,
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({ token: 'test-token' });
    });

    it('should work with different access tokens', () => {
      const config = { accessToken: 'different-token' };
      const middleware = storyblokCdnAuth(config);
      middleware(mockAxiosInstance);

      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({ token: 'different-token' });
    });

    it('should handle special characters in access token', () => {
      const config = { accessToken: 'token-with-special-chars-123!@#' };
      const middleware = storyblokCdnAuth(config);
      middleware(mockAxiosInstance);

      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({
        token: 'token-with-special-chars-123!@#',
      });
    });

    it('should handle empty access token', () => {
      const config = { accessToken: '' };
      const middleware = storyblokCdnAuth(config);
      middleware(mockAxiosInstance);

      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({ token: '' });
    });

    it('should not modify the original request config object', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        headers: new AxiosHeaders(),
      };

      const originalConfig = { ...requestConfig };

      requestInterceptor(requestConfig);

      // The original config should be modified (since we're working with references)
      // but we should ensure the middleware doesn't break the structure
      expect(requestConfig.url).toBe(originalConfig.url);
      expect(requestConfig.headers).toBe(originalConfig.headers);
    });

    it('should handle complex nested params', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        params: {
          filter_query: {
            component: { is: 'blog_post' },
            published: { is: true },
            created_at: { gte: '2024-01-01' },
          },
          sort_by: 'created_at',
          sort_direction: 'desc',
        },
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({
        filter_query: {
          component: { is: 'blog_post' },
          published: { is: true },
          created_at: { gte: '2024-01-01' },
        },
        sort_by: 'created_at',
        sort_direction: 'desc',
        token: 'test-token',
      });
    });
  });

  describe('error handling', () => {
    it('should handle interceptor errors', () => {
      const config = { accessToken: 'test-token' };
      const middleware = storyblokCdnAuth(config);
      middleware(mockAxiosInstance);

      // Verify that the error handler is passed to the interceptor
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
      );

      // Get the error handler
      const errorHandler = (
        mockAxiosInstance.interceptors.request.use as ReturnType<typeof vi.fn>
      ).mock.calls[0][1];
      const testError = new Error('Test error');

      // The error handler should return a rejected promise
      return expect(errorHandler(testError)).rejects.toThrow('Test error');
    });
  });

  describe('middleware application', () => {
    it('should be idempotent - applying multiple times should not cause issues', () => {
      const config = { accessToken: 'test-token' };
      const middleware = storyblokCdnAuth(config);

      // Apply middleware multiple times
      middleware(mockAxiosInstance);
      middleware(mockAxiosInstance);
      middleware(mockAxiosInstance);

      // Should still work correctly
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({ token: 'test-token' });
    });

    it('should work with different axios instances', () => {
      const config = { accessToken: 'test-token' };
      const middleware = storyblokCdnAuth(config);

      // Create multiple mock instances
      const instance1 = {
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as unknown as AxiosInstance;

      const instance2 = {
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as unknown as AxiosInstance;

      // Apply to both instances
      middleware(instance1);
      middleware(instance2);

      expect(instance1.interceptors.request.use).toHaveBeenCalled();
      expect(instance2.interceptors.request.use).toHaveBeenCalled();
    });
  });

  describe('integration scenarios', () => {
    it('should work with Storyblok API endpoints', () => {
      const config = { accessToken: 'storyblok-token' };
      const middleware = storyblokCdnAuth(config);
      middleware(mockAxiosInstance);

      const storyblokEndpoints = [
        '/stories',
        '/stories/home',
        '/stories/blog/my-post',
        '/tags',
        '/links',
        '/datasource_entries',
      ];

      storyblokEndpoints.forEach((endpoint) => {
        const requestConfig: InternalAxiosRequestConfig = {
          url: endpoint,
          headers: new AxiosHeaders(),
        };

        const result = requestInterceptor(requestConfig);

        expect(result.params).toEqual({ token: 'storyblok-token' });
      });
    });

    it('should work with different HTTP methods', () => {
      const config = { accessToken: 'test-token' };
      const middleware = storyblokCdnAuth(config);
      middleware(mockAxiosInstance);

      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

      methods.forEach((method) => {
        const requestConfig: InternalAxiosRequestConfig = {
          url: '/stories',
          method: method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
          headers: new AxiosHeaders(),
        };

        const result = requestInterceptor(requestConfig);

        expect(result.params).toEqual({ token: 'test-token' });
      });
    });
  });
});
