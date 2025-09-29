import axios, { type AxiosInstance } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { storyblokBasePath } from './storyblok-base-path';

describe('storyblokBasePath', () => {
  let axiosInstance: AxiosInstance;
  let middleware: (axiosInstance: AxiosInstance) => void;

  beforeEach(() => {
    axiosInstance = axios.create({
      baseURL: 'https://api.storyblok.com/v2/cdn',
    });
    middleware = storyblokBasePath({ basePath: 'blog/' });
    middleware(axiosInstance);
  });

  describe('when making requests to Stories API', () => {
    it('should add starts_with parameter when not present', () => {
      const requestConfig = {
        url: '/stories',
        params: {},
      };

      // Test the interceptor directly
      const interceptor = axiosInstance.interceptors.request.handlers[0];
      const result = interceptor.fulfilled(requestConfig);

      expect(result).toEqual(
        expect.objectContaining({
          params: expect.objectContaining({
            starts_with: 'blog/',
          }),
        }),
      );
    });

    it('should not override existing starts_with parameter', () => {
      const requestConfig = {
        url: '/stories',
        params: { starts_with: 'news/' },
      };

      const interceptor = axiosInstance.interceptors.request.handlers[0];
      const result = interceptor.fulfilled(requestConfig);

      expect(result).toEqual(
        expect.objectContaining({
          params: expect.objectContaining({
            starts_with: 'news/',
          }),
        }),
      );
    });

    it('should preserve other existing parameters', () => {
      const requestConfig = {
        url: '/stories',
        params: { per_page: 10, sort_by: 'created_at' },
      };

      const interceptor = axiosInstance.interceptors.request.handlers[0];
      const result = interceptor.fulfilled(requestConfig);

      expect(result).toEqual(
        expect.objectContaining({
          params: expect.objectContaining({
            starts_with: 'blog/',
            per_page: 10,
            sort_by: 'created_at',
          }),
        }),
      );
    });
  });

  describe('when making requests to GetLinks API', () => {
    it('should add starts_with parameter when not present', () => {
      const requestConfig = {
        url: '/links',
        params: {},
      };

      const interceptor = axiosInstance.interceptors.request.handlers[0];
      const result = interceptor.fulfilled(requestConfig);

      expect(result).toEqual(
        expect.objectContaining({
          params: expect.objectContaining({
            starts_with: 'blog/',
          }),
        }),
      );
    });

    it('should not override existing starts_with parameter', () => {
      const requestConfig = {
        url: '/links',
        params: { starts_with: 'news/' },
      };

      const interceptor = axiosInstance.interceptors.request.handlers[0];
      const result = interceptor.fulfilled(requestConfig);

      expect(result).toEqual(
        expect.objectContaining({
          params: expect.objectContaining({
            starts_with: 'news/',
          }),
        }),
      );
    });
  });

  describe('when making requests to individual story endpoints', () => {
    it('should prepend basePath to story slug when not already present', () => {
      const requestConfig = {
        url: '/stories/my-article',
        params: {},
      };

      const interceptor = axiosInstance.interceptors.request.handlers[0];
      const result = interceptor.fulfilled(requestConfig);

      expect(result).toEqual(
        expect.objectContaining({
          url: '/stories/blog/my-article',
        }),
      );
    });

    it('should not modify story slug if it already starts with basePath', () => {
      const requestConfig = {
        url: '/stories/blog/my-article',
        params: {},
      };

      const interceptor = axiosInstance.interceptors.request.handlers[0];
      const result = interceptor.fulfilled(requestConfig);

      expect(result).toEqual(
        expect.objectContaining({
          url: '/stories/blog/my-article',
        }),
      );
    });

    it('should handle story requests with query parameters', () => {
      const requestConfig = {
        url: '/stories/my-article?version=draft',
        params: {},
      };

      const interceptor = axiosInstance.interceptors.request.handlers[0];
      const result = interceptor.fulfilled(requestConfig);

      expect(result).toEqual(
        expect.objectContaining({
          url: '/stories/blog/my-article?version=draft',
        }),
      );
    });

    it('should handle story requests with UUID slugs', () => {
      const requestConfig = {
        url: '/stories/12345678-1234-1234-1234-123456789abc',
        params: {},
      };

      const interceptor = axiosInstance.interceptors.request.handlers[0];
      const result = interceptor.fulfilled(requestConfig);

      expect(result).toEqual(
        expect.objectContaining({
          url: '/stories/blog/12345678-1234-1234-1234-123456789abc',
        }),
      );
    });

    it('should handle double slash scenarios when basePath ends with slash', () => {
      const middlewareWithSlash = storyblokBasePath({ basePath: 'blog/' });
      const newAxiosInstance = axios.create({
        baseURL: 'https://api.storyblok.com/v2/cdn',
      });
      middlewareWithSlash(newAxiosInstance);

      const requestConfig = {
        url: '/stories/my-article',
        params: {},
      };

      const interceptor = newAxiosInstance.interceptors.request.handlers[0];
      const result = interceptor.fulfilled(requestConfig);

      expect(result).toEqual(
        expect.objectContaining({
          url: '/stories/blog/my-article', // Should not have double slash
        }),
      );
    });

    it('should handle double slash scenarios when slug starts with slash', () => {
      const requestConfig = {
        url: '/stories//my-article', // Slug with leading slash
        params: {},
      };

      const interceptor = axiosInstance.interceptors.request.handlers[0];
      const result = interceptor.fulfilled(requestConfig);

      expect(result).toEqual(
        expect.objectContaining({
          url: '/stories/blog/my-article', // Should not have double slash
        }),
      );
    });
  });

  describe('when making requests to other endpoints', () => {
    it('should not modify requests to non-Storyblok endpoints', () => {
      const requestConfig = {
        url: '/other-endpoint',
        params: {},
      };

      const interceptor = axiosInstance.interceptors.request.handlers[0];
      const result = interceptor.fulfilled(requestConfig);

      expect(result).toEqual(
        expect.objectContaining({
          params: {},
        }),
      );
    });

    it('should not modify requests to non-Stories/Links Storyblok endpoints', () => {
      const requestConfig = {
        url: '/spaces',
        params: {},
      };

      const interceptor = axiosInstance.interceptors.request.handlers[0];
      const result = interceptor.fulfilled(requestConfig);

      expect(result).toEqual(
        expect.objectContaining({
          params: {},
        }),
      );
    });
  });

  describe('when basePath is empty', () => {
    beforeEach(() => {
      axiosInstance = axios.create({
        baseURL: 'https://api.storyblok.com/v2/cdn',
      });
      middleware = storyblokBasePath({ basePath: '' });
      middleware(axiosInstance);
    });

    it('should still add starts_with parameter with empty value', () => {
      const requestConfig = {
        url: '/stories',
        params: {},
      };

      const interceptor = axiosInstance.interceptors.request.handlers[0];
      const result = interceptor.fulfilled(requestConfig);

      expect(result).toEqual(
        expect.objectContaining({
          params: expect.objectContaining({
            starts_with: '',
          }),
        }),
      );
    });
  });

  describe('error handling', () => {
    it('should pass through request errors', () => {
      const error = new Error('Request failed');
      const interceptor = axiosInstance.interceptors.request.handlers[0];

      expect(() => interceptor.rejected(error)).rejects.toThrow(
        'Request failed',
      );
    });
  });
});
