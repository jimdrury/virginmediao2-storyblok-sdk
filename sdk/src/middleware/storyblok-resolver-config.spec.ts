import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { AxiosHeaders } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { storyblokResolverConfig } from './storyblok-resolver-config';

describe('storyblokResolverConfig', () => {
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
      const config = { resolveRelations: ['blog_post.author'] };
      const middleware = storyblokResolverConfig(config);

      expect(typeof middleware).toBe('function');
    });

    it('should not apply interceptors when no configuration is provided', () => {
      const config = {};
      const middleware = storyblokResolverConfig(config);

      middleware(mockAxiosInstance);

      expect(mockAxiosInstance.interceptors.request.use).not.toHaveBeenCalled();
      expect(
        mockAxiosInstance.interceptors.response.use,
      ).not.toHaveBeenCalled();
    });

    it('should apply interceptors when relations are configured', () => {
      const config = { resolveRelations: ['blog_post.author'] };
      const middleware = storyblokResolverConfig(config);

      middleware(mockAxiosInstance);

      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
      );
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
      );
    });

    it('should apply interceptors when links are configured', () => {
      const config = { resolveLinks: 'story' as const };
      const middleware = storyblokResolverConfig(config);

      middleware(mockAxiosInstance);

      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
      );
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
      );
    });

    it('should apply interceptors when both relations and links are configured', () => {
      const config = {
        resolveRelations: ['blog_post.author'],
        resolveLinks: 'story' as const,
      };
      const middleware = storyblokResolverConfig(config);

      middleware(mockAxiosInstance);

      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
      );
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
      );
    });
  });

  describe('relations resolution functionality', () => {
    beforeEach(() => {
      const config = {
        resolveRelations: ['blog_post.author', 'page.featured_story'],
        removeUnresolvedRelations: false,
      };
      const middleware = storyblokResolverConfig(config);
      middleware(mockAxiosInstance);
    });

    it('should add resolve_relations parameter to request', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({
        resolve_relations: 'blog_post.author,page.featured_story',
      });
    });

    it('should not override existing resolve_relations parameter', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        params: { resolve_relations: 'existing.relation' },
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({
        resolve_relations: 'existing.relation',
      });
    });

    it('should not apply to non-Storyblok requests', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/other-api',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toBeUndefined();
    });

    it('should resolve relations in story response', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            uuid: 'story-uuid',
            content: {
              component: 'blog_post',
              author: 'author-uuid',
            },
          },
          rels: [
            {
              uuid: 'author-uuid',
              name: 'John Doe',
              content: { name: 'John Doe', bio: 'Author bio' },
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories/test',
          headers: new AxiosHeaders(),
        },
      };

      const result = responseInterceptor(response);

      expect(result.data.story.content.author).toEqual({
        uuid: 'author-uuid',
        name: 'John Doe',
        content: { name: 'John Doe', bio: 'Author bio' },
      });
    });

    it('should resolve relations in stories response', () => {
      const response: AxiosResponse = {
        data: {
          stories: [
            {
              uuid: 'story-uuid',
              content: {
                component: 'blog_post',
                author: 'author-uuid',
              },
            },
          ],
          rels: [
            {
              uuid: 'author-uuid',
              name: 'John Doe',
              content: { name: 'John Doe', bio: 'Author bio' },
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories',
          headers: new AxiosHeaders(),
        },
      };

      const result = responseInterceptor(response);

      expect(result.data.stories[0].content.author).toEqual({
        uuid: 'author-uuid',
        name: 'John Doe',
        content: { name: 'John Doe', bio: 'Author bio' },
      });
    });

    it('should handle array relations', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            uuid: 'story-uuid',
            content: {
              component: 'blog_post',
              authors: ['author1-uuid', 'author2-uuid'],
            },
          },
          rels: [
            {
              uuid: 'author1-uuid',
              name: 'John Doe',
              content: { name: 'John Doe' },
            },
            {
              uuid: 'author2-uuid',
              name: 'Jane Smith',
              content: { name: 'Jane Smith' },
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories/test',
          headers: new AxiosHeaders(),
        },
      };

      // Need to configure for authors field
      const config = {
        resolveRelations: ['blog_post.authors'],
        removeUnresolvedRelations: false,
      };
      const middleware = storyblokResolverConfig(config);
      middleware(mockAxiosInstance);

      const result = responseInterceptor(response);

      expect(result.data.story.content.authors).toHaveLength(2);
      expect(result.data.story.content.authors[0].name).toBe('John Doe');
      expect(result.data.story.content.authors[1].name).toBe('Jane Smith');
    });
  });

  describe('links resolution functionality', () => {
    beforeEach(() => {
      const config = { resolveLinks: 'story' as const };
      const middleware = storyblokResolverConfig(config);
      middleware(mockAxiosInstance);
    });

    it('should add resolve_links parameter to request', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({
        resolve_links: 'story',
      });
    });

    it('should not override existing resolve_links parameter', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        params: { resolve_links: 'url' },
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({
        resolve_links: 'url',
      });
    });

    it('should resolve links in story response', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            uuid: 'story-uuid',
            content: {
              link_field: {
                fieldtype: 'multilink',
                id: 'linked-story-uuid',
              },
            },
          },
          links: [
            {
              uuid: 'linked-story-uuid',
              name: 'Linked Story',
              content: { title: 'Linked Story Title' },
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories/test',
          headers: new AxiosHeaders(),
        },
      };

      const result = responseInterceptor(response);

      expect(result.data.story.content.link_field.story).toEqual({
        uuid: 'linked-story-uuid',
        name: 'Linked Story',
        content: { title: 'Linked Story Title' },
      });
    });

    it('should resolve links in stories response', () => {
      const response: AxiosResponse = {
        data: {
          stories: [
            {
              uuid: 'story-uuid',
              content: {
                link_field: {
                  fieldtype: 'multilink',
                  id: 'linked-story-uuid',
                },
              },
            },
          ],
          links: [
            {
              uuid: 'linked-story-uuid',
              name: 'Linked Story',
              content: { title: 'Linked Story Title' },
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories',
          headers: new AxiosHeaders(),
        },
      };

      const result = responseInterceptor(response);

      expect(result.data.stories[0].content.link_field.story).toEqual({
        uuid: 'linked-story-uuid',
        name: 'Linked Story',
        content: { title: 'Linked Story Title' },
      });
    });
  });

  describe('combined relations and links resolution', () => {
    beforeEach(() => {
      const config = {
        resolveRelations: ['blog_post.author'],
        resolveLinks: 'story' as const,
        removeUnresolvedRelations: false,
      };
      const middleware = storyblokResolverConfig(config);
      middleware(mockAxiosInstance);
    });

    it('should add both resolve_relations and resolve_links parameters', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({
        resolve_relations: 'blog_post.author',
        resolve_links: 'story',
      });
    });

    it('should resolve both relations and links in response', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            uuid: 'story-uuid',
            content: {
              component: 'blog_post',
              author: 'author-uuid',
              related_link: {
                fieldtype: 'multilink',
                id: 'linked-story-uuid',
              },
            },
          },
          rels: [
            {
              uuid: 'author-uuid',
              name: 'John Doe',
              content: { name: 'John Doe', bio: 'Author bio' },
            },
          ],
          links: [
            {
              uuid: 'linked-story-uuid',
              name: 'Related Story',
              content: { title: 'Related Story Title' },
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories/test',
          headers: new AxiosHeaders(),
        },
      };

      const result = responseInterceptor(response);

      // Check relations resolution
      expect(result.data.story.content.author).toEqual({
        uuid: 'author-uuid',
        name: 'John Doe',
        content: { name: 'John Doe', bio: 'Author bio' },
      });

      // Check links resolution
      expect(result.data.story.content.related_link.story).toEqual({
        uuid: 'linked-story-uuid',
        name: 'Related Story',
        content: { title: 'Related Story Title' },
      });
    });
  });

  describe('removeUnresolvedRelations functionality', () => {
    beforeEach(() => {
      const config = {
        resolveRelations: ['blog_post.author'],
        removeUnresolvedRelations: true,
      };
      const middleware = storyblokResolverConfig(config);
      middleware(mockAxiosInstance);
    });

    it('should remove unresolved single relations', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            uuid: 'story-uuid',
            content: {
              component: 'blog_post',
              author: 'unresolved-uuid',
            },
          },
          rels: [], // No relations provided
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories/test',
          headers: new AxiosHeaders(),
        },
      };

      const result = responseInterceptor(response);

      expect(result.data.story.content.author).toBeNull();
    });

    it('should filter out unresolved relations from arrays', () => {
      const config = {
        resolveRelations: ['blog_post.authors'],
        removeUnresolvedRelations: true,
      };
      const middleware = storyblokResolverConfig(config);
      middleware(mockAxiosInstance);

      const response: AxiosResponse = {
        data: {
          story: {
            uuid: 'story-uuid',
            content: {
              component: 'blog_post',
              authors: ['resolved-uuid', 'unresolved-uuid'],
            },
          },
          rels: [
            {
              uuid: 'resolved-uuid',
              name: 'John Doe',
              content: { name: 'John Doe' },
            },
          ], // Only one relation provided
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories/test',
          headers: new AxiosHeaders(),
        },
      };

      const result = responseInterceptor(response);

      expect(result.data.story.content.authors).toHaveLength(1);
      expect(result.data.story.content.authors[0].name).toBe('John Doe');
    });
  });

  describe('error handling', () => {
    it('should handle request interceptor errors', () => {
      const config = { resolveRelations: ['blog_post.author'] };
      const middleware = storyblokResolverConfig(config);
      middleware(mockAxiosInstance);

      const errorHandler = (
        mockAxiosInstance.interceptors.request.use as ReturnType<typeof vi.fn>
      ).mock.calls[0][1];
      const testError = new Error('Test error');

      return expect(errorHandler(testError)).rejects.toThrow('Test error');
    });

    it('should handle response interceptor errors', () => {
      const config = { resolveRelations: ['blog_post.author'] };
      const middleware = storyblokResolverConfig(config);
      middleware(mockAxiosInstance);

      const errorHandler = (
        mockAxiosInstance.interceptors.response.use as ReturnType<typeof vi.fn>
      ).mock.calls[0][1];
      const testError = new Error('Test error');

      return expect(errorHandler(testError)).rejects.toThrow('Test error');
    });

    it('should handle malformed response data gracefully', () => {
      const config = { resolveRelations: ['blog_post.author'] };
      const middleware = storyblokResolverConfig(config);
      middleware(mockAxiosInstance);

      const response: AxiosResponse = {
        data: null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories/test',
          headers: new AxiosHeaders(),
        },
      };

      expect(() => responseInterceptor(response)).not.toThrow();
    });

    it('should handle responses without rels or links gracefully', () => {
      const config = {
        resolveRelations: ['blog_post.author'],
        resolveLinks: 'story' as const,
      };
      const middleware = storyblokResolverConfig(config);
      middleware(mockAxiosInstance);

      const response: AxiosResponse = {
        data: {
          story: {
            uuid: 'story-uuid',
            content: {
              component: 'blog_post',
              author: 'author-uuid',
            },
          },
          // No rels or links arrays
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories/test',
          headers: new AxiosHeaders(),
        },
      };

      expect(() => responseInterceptor(response)).not.toThrow();
      expect(response.data.story.content.author).toBe('author-uuid'); // Should remain unchanged
    });
  });

  describe('edge cases', () => {
    it('should handle empty resolveRelations array', () => {
      const config = { resolveRelations: [] };
      const middleware = storyblokResolverConfig(config);

      middleware(mockAxiosInstance);

      expect(mockAxiosInstance.interceptors.request.use).not.toHaveBeenCalled();
      expect(
        mockAxiosInstance.interceptors.response.use,
      ).not.toHaveBeenCalled();
    });

    it('should handle nested object relations', () => {
      const config = { resolveRelations: ['blog_post.author'] };
      const middleware = storyblokResolverConfig(config);
      middleware(mockAxiosInstance);

      const response: AxiosResponse = {
        data: {
          story: {
            uuid: 'story-uuid',
            content: {
              component: 'blog_post',
              sections: [
                {
                  component: 'blog_post',
                  author: 'author-uuid',
                },
              ],
            },
          },
          rels: [
            {
              uuid: 'author-uuid',
              name: 'John Doe',
              content: { name: 'John Doe' },
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories/test',
          headers: new AxiosHeaders(),
        },
      };

      const result = responseInterceptor(response);

      expect(result.data.story.content.sections[0].author).toEqual({
        uuid: 'author-uuid',
        name: 'John Doe',
        content: { name: 'John Doe' },
      });
    });

    it('should work with different link resolution types', () => {
      ['link', 'url', 'story'].forEach((linkType) => {
        const config = { resolveLinks: linkType as 'link' | 'url' | 'story' };
        const middleware = storyblokResolverConfig(config);
        middleware(mockAxiosInstance);

        const requestConfig: InternalAxiosRequestConfig = {
          url: '/stories',
          headers: new AxiosHeaders(),
        };

        const result = requestInterceptor(requestConfig);

        expect(result.params).toEqual({
          resolve_links: linkType,
        });
      });
    });
  });
});
