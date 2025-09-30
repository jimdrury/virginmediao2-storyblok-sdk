import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { AxiosHeaders } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { storyblokPathConfig } from './storyblok-path-config';

describe('storyblokPathConfig', () => {
  let mockAxiosInstance: AxiosInstance;
  let requestInterceptor: (
    config: InternalAxiosRequestConfig,
  ) => InternalAxiosRequestConfig;
  let responseInterceptor: (response: AxiosResponse) => AxiosResponse;

  beforeEach(() => {
    requestInterceptor = vi.fn((config) => config);
    responseInterceptor = vi.fn((response) => response);

    mockAxiosInstance = {
      interceptors: {
        request: {
          use: vi.fn((success, _error) => {
            requestInterceptor = success;
          }),
        },
        response: {
          use: vi.fn((success, _error) => {
            responseInterceptor = success;
          }),
        },
      },
    } as unknown as AxiosInstance;
  });

  describe('middleware creation', () => {
    it('should create a middleware function', () => {
      const config = { basePath: 'blog/' as const };
      const middleware = storyblokPathConfig(config);

      expect(typeof middleware).toBe('function');
    });

    it('should apply request interceptor', () => {
      const config = { basePath: 'blog/' as const };
      const middleware = storyblokPathConfig(config);

      middleware(mockAxiosInstance);

      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
      );
    });

    it('should not apply response interceptor when rewriteLinks is false', () => {
      const config = { basePath: 'blog/' as const };
      const middleware = storyblokPathConfig(config);

      middleware(mockAxiosInstance);

      expect(
        mockAxiosInstance.interceptors.response.use,
      ).not.toHaveBeenCalled();
    });

    it('should apply response interceptor when rewriteLinks is true', () => {
      const config = { basePath: 'blog/' as const, rewriteLinks: true };
      const middleware = storyblokPathConfig(config);

      middleware(mockAxiosInstance);

      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
      );
    });
  });

  describe('request interceptor - individual story requests', () => {
    beforeEach(() => {
      const config = { basePath: 'blog/' as const };
      const middleware = storyblokPathConfig(config);
      middleware(mockAxiosInstance);
    });

    it('should prepend basePath to individual story requests', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories/my-post',
        baseURL: 'https://api.storyblok.com/v2/cdn',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.url).toBe('/stories/blog/my-post');
    });

    it('should prepend basePath to root story requests', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories/',
        baseURL: 'https://api.storyblok.com/v2/cdn',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.url).toBe('/stories/blog/');
    });

    it('should not modify story URLs that already start with basePath', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories/blog/my-post',
        baseURL: 'https://api.storyblok.com/v2/cdn',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      // The middleware currently extracts 'blog/my-post' and checks if it starts with 'blog/'
      // Since 'blog/my-post' starts with 'blog/', it should not be modified
      expect(result.url).toBe('/stories/blog/my-post');
    });

    it('should handle story requests with query parameters', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories/my-post?version=draft',
        baseURL: 'https://api.storyblok.com/v2/cdn',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.url).toBe('/stories/blog/my-post?version=draft');
    });

    it('should handle complex nested paths', () => {
      const config = { basePath: 'en/blog/' as const };
      const middleware = storyblokPathConfig(config);
      middleware(mockAxiosInstance);

      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories/category/my-post',
        baseURL: 'https://api.storyblok.com/v2/cdn',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.url).toBe('/stories/en/blog/category/my-post');
    });
  });

  describe('request interceptor - collection requests', () => {
    beforeEach(() => {
      const config = { basePath: 'blog/' as const };
      const middleware = storyblokPathConfig(config);
      middleware(mockAxiosInstance);
    });

    it('should add starts_with parameter to stories collection requests', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        baseURL: 'https://api.storyblok.com/v2/cdn',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({ starts_with: 'blog/' });
    });

    it('should add starts_with parameter to links requests', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/links',
        baseURL: 'https://api.storyblok.com/v2/cdn',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({ starts_with: 'blog/' });
    });

    it('should not override existing starts_with parameter', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        params: { starts_with: 'existing/' },
        baseURL: 'https://api.storyblok.com/v2/cdn',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({ starts_with: 'existing/' });
    });

    it('should preserve other existing parameters', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        params: { version: 'draft', page: 1 },
        baseURL: 'https://api.storyblok.com/v2/cdn',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({
        version: 'draft',
        page: 1,
        starts_with: 'blog/',
      });
    });
  });

  describe('request interceptor - non-Storyblok requests', () => {
    beforeEach(() => {
      const config = { basePath: 'blog/' as const };
      const middleware = storyblokPathConfig(config);
      middleware(mockAxiosInstance);
    });

    it('should not modify non-Storyblok requests', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/other-api',
        baseURL: 'https://other-api.com',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.url).toBe('/other-api');
      expect(result.params).toBeUndefined();
    });

    it('should not modify non-stories/links Storyblok endpoints', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/tags',
        baseURL: 'https://api.storyblok.com/v2/cdn',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.url).toBe('/tags');
      expect(result.params).toBeUndefined();
    });
  });

  describe('response interceptor - link rewriting', () => {
    beforeEach(() => {
      const config = { basePath: 'blog/' as const, rewriteLinks: true };
      const middleware = storyblokPathConfig(config);
      middleware(mockAxiosInstance);
    });

    it('should remove basePath from story response', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'test-uuid',
            slug: 'blog/my-post',
            full_slug: 'blog/my-post',
            content: { title: 'Test' },
            alternates: [
              {
                id: 2,
                name: 'Alt',
                slug: 'blog/alt-post',
                full_slug: 'blog/alt-post',
                published: true,
                is_folder: false,
                parent_id: null,
              },
            ],
            translated_slugs: [
              {
                path: 'blog/translated-post',
                name: 'Translated',
                lang: 'en',
              },
            ],
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories/blog/my-post',
          baseURL: 'https://api.storyblok.com/v2/cdn',
          headers: new AxiosHeaders(),
        },
      };

      const result = responseInterceptor(response);

      expect(result.data.story.slug).toBe('/my-post');
      expect(result.data.story.full_slug).toBe('/my-post');
      expect(result.data.story.alternates[0].slug).toBe('/alt-post');
      expect(result.data.story.alternates[0].full_slug).toBe('/alt-post');
      expect(result.data.story.translated_slugs[0].path).toBe(
        '/translated-post',
      );
    });

    it('should remove basePath from stories collection response', () => {
      const response: AxiosResponse = {
        data: {
          stories: [
            {
              id: 1,
              uuid: 'test-uuid',
              slug: 'blog/my-post',
              full_slug: 'blog/my-post',
              content: { title: 'Test' },
              alternates: [],
              translated_slugs: [],
            },
            {
              id: 2,
              uuid: 'test-uuid-2',
              slug: 'blog/another-post',
              full_slug: 'blog/another-post',
              content: { title: 'Test 2' },
              alternates: [],
              translated_slugs: [],
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories',
          baseURL: 'https://api.storyblok.com/v2/cdn',
          headers: new AxiosHeaders(),
        },
      };

      const result = responseInterceptor(response);

      expect(result.data.stories[0].slug).toBe('/my-post');
      expect(result.data.stories[0].full_slug).toBe('/my-post');
      expect(result.data.stories[1].slug).toBe('/another-post');
      expect(result.data.stories[1].full_slug).toBe('/another-post');
    });

    it('should remove basePath from links response (object format)', () => {
      const response: AxiosResponse = {
        data: {
          links: {
            '1': {
              id: 1,
              uuid: 'link-uuid',
              slug: 'blog/my-post',
              path: 'blog/my-post',
              real_path: 'blog/my-post',
              name: 'My Post',
              published: true,
              parent_id: null,
              is_folder: false,
              is_startpage: false,
              position: 1,
            },
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/links',
          baseURL: 'https://api.storyblok.com/v2/cdn',
          headers: new AxiosHeaders(),
        },
      };

      const result = responseInterceptor(response);

      expect(result.data.links['1'].slug).toBe('/my-post');
      expect(result.data.links['1'].path).toBe('/my-post');
      expect(result.data.links['1'].real_path).toBe('/my-post');
    });

    it('should handle links response with alternates', () => {
      const response: AxiosResponse = {
        data: {
          links: {
            '1': {
              id: 1,
              uuid: 'link-uuid',
              slug: 'blog/my-post',
              path: 'blog/my-post',
              real_path: 'blog/my-post',
              name: 'My Post',
              published: true,
              parent_id: null,
              is_folder: false,
              is_startpage: false,
              position: 1,
              alternates: [
                {
                  path: 'blog/en-post',
                  name: 'English Post',
                  lang: 'en',
                  published: true,
                  translated_slug: 'blog/en-post',
                },
              ],
            },
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/links',
          baseURL: 'https://api.storyblok.com/v2/cdn',
          headers: new AxiosHeaders(),
        },
      };

      const result = responseInterceptor(response);

      expect(result.data.links['1'].alternates[0].path).toBe('/en-post');
      expect(result.data.links['1'].alternates[0].translated_slug).toBe(
        '/en-post',
      );
    });

    it('should process story content recursively', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'test-uuid',
            slug: 'blog/my-post',
            full_slug: 'blog/my-post',
            content: {
              title: 'Test',
              url: 'blog/my-post',
              sections: [
                {
                  component: 'section',
                  link: 'blog/linked-post',
                  nested: {
                    deep_link: 'blog/deep-post',
                  },
                },
              ],
              related_posts: ['blog/post1', 'blog/post2'],
            },
            alternates: [],
            translated_slugs: [],
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories/blog/my-post',
          baseURL: 'https://api.storyblok.com/v2/cdn',
          headers: new AxiosHeaders(),
        },
      };

      const result = responseInterceptor(response);

      expect(result.data.story.content.url).toBe('/my-post');
      expect(result.data.story.content.sections[0].link).toBe('/linked-post');
      expect(result.data.story.content.sections[0].nested.deep_link).toBe(
        '/deep-post',
      );
      expect(result.data.story.content.related_posts[0]).toBe('/post1');
      expect(result.data.story.content.related_posts[1]).toBe('/post2');
    });

    it('should handle rels array in story response', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'test-uuid',
            slug: 'blog/my-post',
            full_slug: 'blog/my-post',
            content: { title: 'Test' },
            alternates: [],
            translated_slugs: [],
          },
          rels: [
            {
              id: 2,
              uuid: 'rel-uuid',
              slug: 'blog/related-post',
              full_slug: 'blog/related-post',
              content: { title: 'Related' },
              alternates: [],
              translated_slugs: [],
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories/blog/my-post',
          baseURL: 'https://api.storyblok.com/v2/cdn',
          headers: new AxiosHeaders(),
        },
      };

      const result = responseInterceptor(response);

      expect(result.data.rels[0].slug).toBe('/related-post');
      expect(result.data.rels[0].full_slug).toBe('/related-post');
    });

    it('should handle links array in story response (simplified story objects)', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'test-uuid',
            slug: 'blog/my-post',
            full_slug: 'blog/my-post',
            content: { title: 'Test' },
            alternates: [],
            translated_slugs: [],
          },
          links: [
            {
              full_slug: 'blog/linked-post',
              url: 'blog/linked-post',
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories/blog/my-post',
          baseURL: 'https://api.storyblok.com/v2/cdn',
          headers: new AxiosHeaders(),
        },
      };

      const result = responseInterceptor(response);

      expect(result.data.links[0].full_slug).toBe('/linked-post');
      expect(result.data.links[0].url).toBe('/linked-post');
    });

    it('should handle links array with full story objects', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'test-uuid',
            slug: 'blog/my-post',
            full_slug: 'blog/my-post',
            content: { title: 'Test' },
            alternates: [],
            translated_slugs: [],
          },
          links: [
            {
              id: 2,
              uuid: 'link-uuid',
              name: 'Linked Post',
              slug: 'blog/linked-post',
              full_slug: 'blog/linked-post',
              content: { title: 'Linked' },
              created_at: '2024-01-01T00:00:00.000Z',
              updated_at: '2024-01-01T00:00:00.000Z',
              published_at: '2024-01-01T00:00:00.000Z',
              first_published_at: '2024-01-01T00:00:00.000Z',
              sort_by_date: null,
              tag_list: [],
              is_startpage: false,
              parent_id: null,
              meta_data: null,
              group_id: 'test-group',
              alternates: [],
              translated_slugs: [],
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories/blog/my-post',
          baseURL: 'https://api.storyblok.com/v2/cdn',
          headers: new AxiosHeaders(),
        },
      };

      // The response interceptor should process the response without throwing
      expect(() => responseInterceptor(response)).not.toThrow();

      // Verify the response structure is maintained
      expect(response.data.links).toHaveLength(1);
      expect(response.data.links[0].id).toBe(2);
      expect(response.data.links[0].content.title).toBe('Linked');
    });

    it('should handle links array with StoryblokLink objects (real_path)', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'test-uuid',
            slug: 'blog/my-post',
            full_slug: 'blog/my-post',
            content: { title: 'Test' },
            alternates: [],
            translated_slugs: [],
          },
          links: [
            {
              id: 2,
              uuid: 'link-uuid',
              slug: 'blog/linked-post',
              path: 'blog/linked-post',
              real_path: 'blog/linked-post',
              name: 'Linked Post',
              published: true,
              parent_id: null,
              is_folder: false,
              is_startpage: false,
              position: 1,
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories/blog/my-post',
          baseURL: 'https://api.storyblok.com/v2/cdn',
          headers: new AxiosHeaders(),
        },
      };

      const result = responseInterceptor(response);

      expect(result.data.links[0].slug).toBe('/linked-post');
      expect(result.data.links[0].path).toBe('/linked-post');
      expect(result.data.links[0].real_path).toBe('/linked-post');
    });

    it('should not process non-Storyblok responses', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            slug: 'blog/my-post',
            full_slug: 'blog/my-post',
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/other-api',
          baseURL: 'https://other-api.com',
          headers: new AxiosHeaders(),
        },
      };

      const result = responseInterceptor(response);

      expect(result.data.story.slug).toBe('blog/my-post');
      expect(result.data.story.full_slug).toBe('blog/my-post');
    });

    it('should handle malformed response data gracefully', () => {
      const response: AxiosResponse = {
        data: null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories/blog/my-post',
          baseURL: 'https://api.storyblok.com/v2/cdn',
          headers: new AxiosHeaders(),
        },
      };

      expect(() => responseInterceptor(response)).not.toThrow();
      expect(response.data).toBe(null);
    });

    it('should handle responses without story data', () => {
      const response: AxiosResponse = {
        data: {
          other_data: 'test',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories/blog/my-post',
          baseURL: 'https://api.storyblok.com/v2/cdn',
          headers: new AxiosHeaders(),
        },
      };

      const result = responseInterceptor(response);

      expect(result.data.other_data).toBe('test');
    });

    it('should handle edge cases with empty or null paths', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'test-uuid',
            slug: '',
            full_slug: '',
            content: { title: 'Test' },
            alternates: [
              {
                id: 2,
                name: 'Alt',
                slug: '',
                full_slug: '',
                published: true,
                is_folder: false,
                parent_id: null,
              },
            ],
            translated_slugs: [
              {
                path: '',
                name: 'Translated',
                lang: 'en',
              },
            ],
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories/blog/my-post',
          baseURL: 'https://api.storyblok.com/v2/cdn',
          headers: new AxiosHeaders(),
        },
      };

      expect(() => responseInterceptor(response)).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle different basePath formats', () => {
      const testCases = [
        { basePath: 'blog/' as const, expected: 'blog/' },
        { basePath: 'en/blog/' as const, expected: 'en/blog/' },
        {
          basePath: 'complex/nested/path/' as const,
          expected: 'complex/nested/path/',
        },
      ];

      testCases.forEach(({ basePath, expected }) => {
        const config = { basePath };
        const middleware = storyblokPathConfig(config);
        middleware(mockAxiosInstance);

        const requestConfig: InternalAxiosRequestConfig = {
          url: '/stories',
          baseURL: 'https://api.storyblok.com/v2/cdn',
          headers: new AxiosHeaders(),
        };

        const result = requestInterceptor(requestConfig);

        expect(result.params).toEqual({ starts_with: expected });
      });
    });

    it('should handle missing URL gracefully', () => {
      const config = { basePath: 'blog/' as const };
      const middleware = storyblokPathConfig(config);
      middleware(mockAxiosInstance);

      const requestConfig: InternalAxiosRequestConfig = {
        baseURL: 'https://api.storyblok.com/v2/cdn',
        headers: new AxiosHeaders(),
      };

      expect(() => requestInterceptor(requestConfig)).not.toThrow();
    });

    it('should be idempotent when applied multiple times', () => {
      const config = { basePath: 'blog/' as const };
      const middleware = storyblokPathConfig(config);

      middleware(mockAxiosInstance);
      middleware(mockAxiosInstance);
      middleware(mockAxiosInstance);

      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories/my-post',
        baseURL: 'https://api.storyblok.com/v2/cdn',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.url).toBe('/stories/blog/my-post');
    });
  });
});
