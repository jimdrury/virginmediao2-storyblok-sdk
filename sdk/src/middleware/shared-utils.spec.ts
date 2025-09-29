import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import {
  addParamIfNotPresent,
  ensureRequestParams,
  extractSlugFromUrl,
  isIndividualStoryRequest,
  isStoriesOrLinksRequest,
  isStoryblokCdnRequest,
  isStoryblokCdnResponse,
  joinPaths,
  standardErrorHandler,
} from './shared-utils';

describe('shared-utils', () => {
  describe('standardErrorHandler', () => {
    it('should return a rejected promise with the error', async () => {
      const error = new Error('Test error');

      await expect(standardErrorHandler(error)).rejects.toThrow('Test error');
    });

    it('should handle different error types', async () => {
      const stringError = 'String error';
      const objectError = { message: 'Object error' };

      await expect(standardErrorHandler(stringError)).rejects.toBe(stringError);
      await expect(standardErrorHandler(objectError)).rejects.toBe(objectError);
    });
  });

  describe('isStoryblokCdnRequest', () => {
    it('should return true for Storyblok API baseURL', () => {
      const config: InternalAxiosRequestConfig = {
        baseURL: 'https://api.storyblok.com/v2/cdn',
        url: '/stories',
        headers: new AxiosHeaders(),
      };

      expect(isStoryblokCdnRequest(config)).toBe(true);
    });

    it('should return true for CDN baseURL', () => {
      const config: InternalAxiosRequestConfig = {
        baseURL: 'https://cdn.storyblok.com',
        url: '/stories',
        headers: new AxiosHeaders(),
      };

      expect(isStoryblokCdnRequest(config)).toBe(true);
    });

    it('should return true for stories URL', () => {
      const config: InternalAxiosRequestConfig = {
        url: '/stories',
        headers: new AxiosHeaders(),
      };

      expect(isStoryblokCdnRequest(config)).toBe(true);
    });

    it('should return true for links URL', () => {
      const config: InternalAxiosRequestConfig = {
        url: '/links',
        headers: new AxiosHeaders(),
      };

      expect(isStoryblokCdnRequest(config)).toBe(true);
    });

    it('should return false for non-Storyblok requests', () => {
      const config: InternalAxiosRequestConfig = {
        baseURL: 'https://other-api.com',
        url: '/other-endpoint',
        headers: new AxiosHeaders(),
      };

      expect(isStoryblokCdnRequest(config)).toBe(false);
    });

    it('should handle missing baseURL and url', () => {
      const config: InternalAxiosRequestConfig = {
        headers: new AxiosHeaders(),
      };

      expect(isStoryblokCdnRequest(config)).toBe(false);
    });

    it('should handle empty strings', () => {
      const config: InternalAxiosRequestConfig = {
        baseURL: '',
        url: '',
        headers: new AxiosHeaders(),
      };

      expect(isStoryblokCdnRequest(config)).toBe(false);
    });
  });

  describe('isStoryblokCdnResponse', () => {
    it('should return true for Storyblok CDN response', () => {
      const response: AxiosResponse = {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories',
          headers: new AxiosHeaders(),
        },
      };

      expect(isStoryblokCdnResponse(response)).toBe(true);
    });

    it('should return false for non-Storyblok response', () => {
      const response: AxiosResponse = {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/other-api',
          headers: new AxiosHeaders(),
        },
      };

      expect(isStoryblokCdnResponse(response)).toBe(false);
    });
  });

  describe('isStoriesOrLinksRequest', () => {
    it('should return true for stories requests', () => {
      const config: InternalAxiosRequestConfig = {
        url: '/stories',
        headers: new AxiosHeaders(),
      };

      expect(isStoriesOrLinksRequest(config)).toBe(true);
    });

    it('should return true for individual story requests', () => {
      const config: InternalAxiosRequestConfig = {
        url: '/stories/my-slug',
        headers: new AxiosHeaders(),
      };

      expect(isStoriesOrLinksRequest(config)).toBe(true);
    });

    it('should return true for links requests', () => {
      const config: InternalAxiosRequestConfig = {
        url: '/links',
        headers: new AxiosHeaders(),
      };

      expect(isStoriesOrLinksRequest(config)).toBe(true);
    });

    it('should return false for other endpoints', () => {
      const config: InternalAxiosRequestConfig = {
        url: '/tags',
        headers: new AxiosHeaders(),
      };

      expect(isStoriesOrLinksRequest(config)).toBe(false);
    });

    it('should handle missing url', () => {
      const config: InternalAxiosRequestConfig = {
        headers: new AxiosHeaders(),
      };

      expect(isStoriesOrLinksRequest(config)).toBe(false);
    });
  });

  describe('isIndividualStoryRequest', () => {
    it('should return true for individual story requests', () => {
      expect(isIndividualStoryRequest('/stories/my-slug')).toBe(true);
      expect(isIndividualStoryRequest('/stories/blog/my-post')).toBe(true);
      expect(isIndividualStoryRequest('/stories/nested/path/story')).toBe(true);
    });

    it('should return true for root story requests', () => {
      expect(isIndividualStoryRequest('/stories/')).toBe(true);
    });

    it('should return true for story requests with query parameters', () => {
      expect(isIndividualStoryRequest('/stories/my-slug?version=draft')).toBe(
        true,
      );
      expect(isIndividualStoryRequest('/stories/?version=draft')).toBe(true);
    });

    it('should return false for collection requests', () => {
      expect(isIndividualStoryRequest('/stories')).toBe(false);
    });

    it('should return false for other endpoints', () => {
      expect(isIndividualStoryRequest('/links')).toBe(false);
      expect(isIndividualStoryRequest('/tags')).toBe(false);
      expect(isIndividualStoryRequest('/other')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isIndividualStoryRequest('')).toBe(false);
      expect(isIndividualStoryRequest('/stories/slug/extra/path')).toBe(true); // This is actually a valid story slug with slashes
    });
  });

  describe('extractSlugFromUrl', () => {
    it('should extract slug from story URL', () => {
      expect(extractSlugFromUrl('/stories/my-slug')).toBe('my-slug');
      expect(extractSlugFromUrl('/stories/blog/my-post')).toBe('blog/my-post');
      expect(extractSlugFromUrl('/stories/nested/path/story')).toBe(
        'nested/path/story',
      );
    });

    it('should extract empty string for root story', () => {
      expect(extractSlugFromUrl('/stories/')).toBe('');
    });

    it('should handle query parameters', () => {
      expect(extractSlugFromUrl('/stories/my-slug?version=draft')).toBe(
        'my-slug',
      );
      expect(extractSlugFromUrl('/stories/?version=draft')).toBe('');
    });

    it('should return null for invalid URLs', () => {
      expect(extractSlugFromUrl('/stories')).toBe(null);
      expect(extractSlugFromUrl('/links')).toBe(null);
      expect(extractSlugFromUrl('/other')).toBe(null);
      expect(extractSlugFromUrl('')).toBe(null);
    });

    it('should handle special characters in slugs', () => {
      expect(extractSlugFromUrl('/stories/my-slug-123')).toBe('my-slug-123');
      expect(extractSlugFromUrl('/stories/slug_with_underscores')).toBe(
        'slug_with_underscores',
      );
    });
  });

  describe('joinPaths', () => {
    it('should join paths correctly', () => {
      expect(joinPaths('blog/', 'my-post')).toBe('blog/my-post');
      expect(joinPaths('blog', 'my-post')).toBe('blog/my-post');
      expect(joinPaths('blog/', '/my-post')).toBe('blog/my-post');
      expect(joinPaths('blog', '/my-post')).toBe('blog/my-post');
    });

    it('should handle empty segments', () => {
      expect(joinPaths('blog/', '')).toBe('blog/');
      expect(joinPaths('', 'my-post')).toBe('/my-post');
      expect(joinPaths('', '')).toBe('/');
    });

    it('should handle nested paths', () => {
      expect(joinPaths('en/blog/', 'category/my-post')).toBe(
        'en/blog/category/my-post',
      );
      expect(joinPaths('en/blog/', '/category/my-post')).toBe(
        'en/blog/category/my-post',
      );
    });

    it('should handle multiple slashes', () => {
      expect(joinPaths('blog//', '//my-post')).toBe('blog/my-post');
      expect(joinPaths('blog///', '///my-post')).toBe('blog/my-post');
    });
  });

  describe('ensureRequestParams', () => {
    it('should initialize params when undefined', () => {
      const config: InternalAxiosRequestConfig = {
        url: '/stories',
        headers: new AxiosHeaders(),
      };

      ensureRequestParams(config);

      expect(config.params).toEqual({});
    });

    it('should not modify existing params', () => {
      const existingParams = { page: 1 };
      const config: InternalAxiosRequestConfig = {
        url: '/stories',
        params: existingParams,
        headers: new AxiosHeaders(),
      };

      ensureRequestParams(config);

      expect(config.params).toBe(existingParams);
    });

    it('should handle null params', () => {
      const config: InternalAxiosRequestConfig = {
        url: '/stories',
        params: null,
        headers: new AxiosHeaders(),
      };

      ensureRequestParams(config);

      expect(config.params).toEqual({});
    });
  });

  describe('addParamIfNotPresent', () => {
    it('should add parameter when not present', () => {
      const config: InternalAxiosRequestConfig = {
        url: '/stories',
        headers: new AxiosHeaders(),
      };

      addParamIfNotPresent(config, 'token', 'test-token');

      expect(config.params).toEqual({ token: 'test-token' });
    });

    it('should not override existing parameter', () => {
      const config: InternalAxiosRequestConfig = {
        url: '/stories',
        params: { token: 'existing-token' },
        headers: new AxiosHeaders(),
      };

      addParamIfNotPresent(config, 'token', 'new-token');

      expect(config.params).toEqual({ token: 'existing-token' });
    });

    it('should add parameter to existing params', () => {
      const config: InternalAxiosRequestConfig = {
        url: '/stories',
        params: { page: 1 },
        headers: new AxiosHeaders(),
      };

      addParamIfNotPresent(config, 'token', 'test-token');

      expect(config.params).toEqual({ page: 1, token: 'test-token' });
    });

    it('should handle null params', () => {
      const config: InternalAxiosRequestConfig = {
        url: '/stories',
        params: null,
        headers: new AxiosHeaders(),
      };

      addParamIfNotPresent(config, 'token', 'test-token');

      expect(config.params).toEqual({ token: 'test-token' });
    });

    it('should handle different value types', () => {
      const config: InternalAxiosRequestConfig = {
        url: '/stories',
        headers: new AxiosHeaders(),
      };

      addParamIfNotPresent(config, 'page', 1);
      addParamIfNotPresent(config, 'published', true);
      addParamIfNotPresent(config, 'filter', { component: 'blog_post' });

      expect(config.params).toEqual({
        page: 1,
        published: true,
        filter: { component: 'blog_post' },
      });
    });

    it('should handle falsy values correctly', () => {
      const config: InternalAxiosRequestConfig = {
        url: '/stories',
        headers: new AxiosHeaders(),
      };

      addParamIfNotPresent(config, 'page', 0);
      addParamIfNotPresent(config, 'published', false);
      addParamIfNotPresent(config, 'search', '');

      expect(config.params).toEqual({
        page: 0,
        published: false,
        search: '',
      });
    });
  });
});
