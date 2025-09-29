import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { AxiosHeaders } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  type StoryblokLinksResolverConfig,
  storyblokLinksResolver,
} from './storyblok-links-resolver';

describe('storyblokLinksResolver', () => {
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

  it('should add interceptors when link resolution is configured', () => {
    const config: StoryblokLinksResolverConfig = {
      resolveLinks: 'url',
    };
    const middleware = storyblokLinksResolver(config);

    middleware(mockAxiosInstance);

    expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
    expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
  });

  describe('request interceptor', () => {
    beforeEach(() => {
      const config: StoryblokLinksResolverConfig = {
        resolveLinks: 'url',
      };
      const middleware = storyblokLinksResolver(config);
      middleware(mockAxiosInstance);
    });

    it('should add resolve_links to Storyblok CDN requests', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        baseURL: 'https://api.storyblok.com/v2/cdn',
        params: {},
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params.resolve_links).toBe('url');
    });

    it('should not modify non-Storyblok requests', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/api/test',
        baseURL: 'https://example.com',
        params: {},
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params.resolve_links).toBeUndefined();
    });

    it('should not modify requests that already have resolve_links', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        baseURL: 'https://api.storyblok.com/v2/cdn',
        params: {
          resolve_links: 'story',
        },
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params.resolve_links).toBe('story');
    });

    it('should initialize params if not present', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        baseURL: 'https://api.storyblok.com/v2/cdn',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toBeDefined();
      expect(result.params.resolve_links).toBe('url');
    });

    it('should support different resolve_links values', () => {
      const configs: StoryblokLinksResolverConfig[] = [
        { resolveLinks: 'link' },
        { resolveLinks: 'url' },
        { resolveLinks: 'story' },
      ];

      configs.forEach((config) => {
        const middleware = storyblokLinksResolver(config);
        const mockInstance = {
          interceptors: {
            request: {
              use: vi.fn((success) => {
                const requestConfig: InternalAxiosRequestConfig = {
                  url: '/stories',
                  baseURL: 'https://api.storyblok.com/v2/cdn',
                  headers: new AxiosHeaders(),
                };
                const result = success(requestConfig);
                expect(result.params.resolve_links).toBe(config.resolveLinks);
              }),
            },
            response: { use: vi.fn() },
          },
        } as unknown as AxiosInstance;

        middleware(mockInstance);
      });
    });
  });

  describe('response interceptor', () => {
    beforeEach(() => {
      const config: StoryblokLinksResolverConfig = {
        resolveLinks: 'url',
      };
      const middleware = storyblokLinksResolver(config);
      middleware(mockAxiosInstance);
    });

    it('should not modify non-Storyblok responses', () => {
      const response: AxiosResponse = {
        data: { some: 'data' },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: {
          url: '/api/test',
          baseURL: 'https://example.com',
        } as InternalAxiosRequestConfig,
      };

      const result = responseInterceptor(response);

      expect(result).toBe(response);
      expect(result.data).toEqual({ some: 'data' });
    });

    it('should not modify responses without links', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'story-uuid',
            content: { component: 'page' },
          },
        },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: {
          url: '/stories',
          baseURL: 'https://api.storyblok.com/v2/cdn',
        } as InternalAxiosRequestConfig,
      };

      const result = responseInterceptor(response);

      expect(result).toBe(response);
    });

    it('should resolve single story links', () => {
      const mockLinkedStory = {
        id: 2,
        uuid: 'linked-uuid',
        name: 'Linked Story',
        content: { component: 'page', title: 'Linked Page' },
      };

      const response: AxiosResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'story-uuid',
            content: {
              component: 'page',
              link: {
                fieldtype: 'multilink',
                id: 'linked-uuid',
                cached_url: '/linked-page',
              },
            },
          },
          links: [mockLinkedStory],
        },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: {
          url: '/stories',
          baseURL: 'https://api.storyblok.com/v2/cdn',
        } as InternalAxiosRequestConfig,
      };

      const result = responseInterceptor(response);

      expect(result.data.story.content.link).toEqual({
        fieldtype: 'multilink',
        id: 'linked-uuid',
        cached_url: '/linked-page',
        story: mockLinkedStory,
      });
    });

    it('should resolve array of story links', () => {
      const mockLinkedStory1 = {
        id: 2,
        uuid: 'linked-uuid-1',
        name: 'Linked Story 1',
        content: { component: 'page', title: 'Linked Page 1' },
      };

      const mockLinkedStory2 = {
        id: 3,
        uuid: 'linked-uuid-2',
        name: 'Linked Story 2',
        content: { component: 'page', title: 'Linked Page 2' },
      };

      const response: AxiosResponse = {
        data: {
          stories: [
            {
              id: 1,
              uuid: 'story-uuid',
              content: {
                component: 'page',
                links: [
                  {
                    fieldtype: 'multilink',
                    id: 'linked-uuid-1',
                    cached_url: '/linked-page-1',
                  },
                  {
                    fieldtype: 'multilink',
                    id: 'linked-uuid-2',
                    cached_url: '/linked-page-2',
                  },
                ],
              },
            },
          ],
          links: [mockLinkedStory1, mockLinkedStory2],
        },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: {
          url: '/stories',
          baseURL: 'https://api.storyblok.com/v2/cdn',
        } as InternalAxiosRequestConfig,
      };

      const result = responseInterceptor(response);

      expect(result.data.stories[0].content.links).toEqual([
        {
          fieldtype: 'multilink',
          id: 'linked-uuid-1',
          cached_url: '/linked-page-1',
          story: mockLinkedStory1,
        },
        {
          fieldtype: 'multilink',
          id: 'linked-uuid-2',
          cached_url: '/linked-page-2',
          story: mockLinkedStory2,
        },
      ]);
    });

    it('should handle nested objects recursively', () => {
      const mockLinkedStory = {
        id: 2,
        uuid: 'linked-uuid',
        name: 'Linked Story',
        content: { component: 'page', title: 'Linked Page' },
      };

      const response: AxiosResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'story-uuid',
            content: {
              component: 'page',
              body: [
                {
                  component: 'button',
                  link: {
                    fieldtype: 'multilink',
                    id: 'linked-uuid',
                    cached_url: '/linked-page',
                  },
                },
              ],
            },
          },
          links: [mockLinkedStory],
        },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: {
          url: '/stories',
          baseURL: 'https://api.storyblok.com/v2/cdn',
        } as InternalAxiosRequestConfig,
      };

      const result = responseInterceptor(response);

      expect(result.data.story.content.body[0].link).toEqual({
        fieldtype: 'multilink',
        id: 'linked-uuid',
        cached_url: '/linked-page',
        story: mockLinkedStory,
      });
    });

    it('should leave unresolved links as original objects', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'story-uuid',
            content: {
              component: 'page',
              link: {
                fieldtype: 'multilink',
                id: 'missing-uuid',
                cached_url: '/missing-page',
              },
            },
          },
          links: [],
        },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: {
          url: '/stories',
          baseURL: 'https://api.storyblok.com/v2/cdn',
        } as InternalAxiosRequestConfig,
      };

      const result = responseInterceptor(response);

      expect(result.data.story.content.link).toEqual({
        fieldtype: 'multilink',
        id: 'missing-uuid',
        cached_url: '/missing-page',
      });
    });

    it('should only process objects with filetype: multilink and id field', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'story-uuid',
            content: {
              component: 'page',
              regularField: 'should not be processed',
              linkWithoutFiletype: {
                id: 'some-id',
                cached_url: '/some-url',
              },
              linkWithWrongFiletype: {
                filetype: 'image',
                id: 'some-id',
                cached_url: '/some-url',
              },
              validLink: {
                fieldtype: 'multilink',
                id: 'linked-uuid',
                cached_url: '/linked-page',
              },
            },
          },
          links: [
            {
              id: 2,
              uuid: 'linked-uuid',
              name: 'Linked Story',
              content: { component: 'page' },
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: {
          url: '/stories',
          baseURL: 'https://api.storyblok.com/v2/cdn',
        } as InternalAxiosRequestConfig,
      };

      const result = responseInterceptor(response);

      expect(result.data.story.content.regularField).toBe(
        'should not be processed',
      );
      expect(result.data.story.content.linkWithoutFiletype).toEqual({
        id: 'some-id',
        cached_url: '/some-url',
      });
      expect(result.data.story.content.linkWithWrongFiletype).toEqual({
        filetype: 'image',
        id: 'some-id',
        cached_url: '/some-url',
      });
      expect(result.data.story.content.validLink).toEqual({
        fieldtype: 'multilink',
        id: 'linked-uuid',
        cached_url: '/linked-page',
        story: {
          id: 2,
          uuid: 'linked-uuid',
          name: 'Linked Story',
          content: { component: 'page' },
        },
      });
    });
  });
});
