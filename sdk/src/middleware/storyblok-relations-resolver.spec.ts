import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { AxiosHeaders } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  type StoryblokRelationsResolverConfig,
  storyblokRelationsResolver,
} from './storyblok-relations-resolver';

describe('storyblokRelationsResolver', () => {
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

  it('should not add interceptors when no relation patterns are provided', () => {
    const config: StoryblokRelationsResolverConfig = { resolveRelations: [] };
    const middleware = storyblokRelationsResolver(config);

    middleware(mockAxiosInstance);

    expect(mockAxiosInstance.interceptors.request.use).not.toHaveBeenCalled();
    expect(mockAxiosInstance.interceptors.response.use).not.toHaveBeenCalled();
  });

  it('should add interceptors when relation patterns are provided', () => {
    const config: StoryblokRelationsResolverConfig = {
      resolveRelations: [
        'dynamo_content_fragment.fragment',
        'o2_card_basic.link',
      ],
    };
    const middleware = storyblokRelationsResolver(config);

    middleware(mockAxiosInstance);

    expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
    expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
  });

  describe('request interceptor', () => {
    beforeEach(() => {
      const config: StoryblokRelationsResolverConfig = {
        resolveRelations: [
          'dynamo_content_fragment.fragment',
          'o2_card_basic.link',
        ],
      };
      const middleware = storyblokRelationsResolver(config);
      middleware(mockAxiosInstance);
    });

    it('should add resolve_relations to Storyblok CDN requests', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        baseURL: 'https://api.storyblok.com/v2/cdn',
        params: {},
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params.resolve_relations).toBe(
        'dynamo_content_fragment.fragment,o2_card_basic.link',
      );
    });

    it('should not modify non-Storyblok requests', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/api/test',
        baseURL: 'https://example.com',
        params: {},
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params.resolve_relations).toBeUndefined();
    });

    it('should not modify requests that already have resolve_relations', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        baseURL: 'https://api.storyblok.com/v2/cdn',
        params: {
          resolve_relations: 'existing.relation',
        },
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params.resolve_relations).toBe('existing.relation');
    });

    it('should initialize params if not present', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        baseURL: 'https://api.storyblok.com/v2/cdn',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toBeDefined();
      expect(result.params.resolve_relations).toBe(
        'dynamo_content_fragment.fragment,o2_card_basic.link',
      );
    });
  });

  describe('response interceptor', () => {
    beforeEach(() => {
      const config: StoryblokRelationsResolverConfig = {
        resolveRelations: [
          'dynamo_content_fragment.fragment',
          'o2_card_basic.link',
        ],
      };
      const middleware = storyblokRelationsResolver(config);
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

    it('should not modify responses without rels', () => {
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

    it('should resolve single story relations', () => {
      const mockRelatedStory = {
        id: 2,
        uuid: 'related-uuid',
        name: 'Related Story',
        content: { component: 'fragment', text: 'Hello World' },
      };

      const response: AxiosResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'story-uuid',
            content: {
              component: 'dynamo_content_fragment',
              fragment: 'related-uuid',
            },
          },
          rels: [mockRelatedStory],
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

      expect(result.data.story.content.fragment).toEqual(mockRelatedStory);
    });

    it('should resolve array of story relations', () => {
      const mockRelatedStory1 = {
        id: 2,
        uuid: 'related-uuid-1',
        name: 'Related Story 1',
        content: { component: 'fragment', text: 'Hello' },
      };

      const mockRelatedStory2 = {
        id: 3,
        uuid: 'related-uuid-2',
        name: 'Related Story 2',
        content: { component: 'fragment', text: 'World' },
      };

      const response: AxiosResponse = {
        data: {
          stories: [
            {
              id: 1,
              uuid: 'story-uuid',
              content: {
                component: 'dynamo_content_fragment',
                fragment: ['related-uuid-1', 'related-uuid-2'],
              },
            },
          ],
          rels: [mockRelatedStory1, mockRelatedStory2],
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

      expect(result.data.stories[0].content.fragment).toEqual([
        mockRelatedStory1,
        mockRelatedStory2,
      ]);
    });

    it('should handle nested objects recursively', () => {
      const mockRelatedStory = {
        id: 2,
        uuid: 'related-uuid',
        name: 'Related Story',
        content: { component: 'fragment', text: 'Hello World' },
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
                  component: 'dynamo_content_fragment',
                  fragment: 'related-uuid',
                },
              ],
            },
          },
          rels: [mockRelatedStory],
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

      expect(result.data.story.content.body[0].fragment).toEqual(
        mockRelatedStory,
      );
    });

    it('should leave unresolved relations as strings when removeUnresolvedRelations is false', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'story-uuid',
            content: {
              component: 'dynamo_content_fragment',
              fragment: 'missing-uuid',
            },
          },
          rels: [],
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

      expect(result.data.story.content.fragment).toBe('missing-uuid');
    });

    describe('with removeUnresolvedRelations: true', () => {
      let removeUnresolvedResponseInterceptor: (
        response: AxiosResponse,
      ) => AxiosResponse;

      beforeEach(() => {
        // Reset the mock and ensure we capture the correct interceptor
        removeUnresolvedResponseInterceptor = vi.fn((response) => response);
        mockAxiosInstance = {
          interceptors: {
            request: {
              use: vi.fn((_success, _error) => {
                // Don't override requestInterceptor here since we don't use it in this nested describe
              }),
            },
            response: {
              use: vi.fn((success, _error) => {
                removeUnresolvedResponseInterceptor = success;
              }),
            },
          },
        } as unknown as AxiosInstance;

        const config: StoryblokRelationsResolverConfig = {
          resolveRelations: ['dynamo_content_fragment.fragment'],
          removeUnresolvedRelations: true,
        };
        const middleware = storyblokRelationsResolver(config);
        middleware(mockAxiosInstance);
      });

      it('should remove unresolved string relations', () => {
        const response: AxiosResponse = {
          data: {
            story: {
              id: 1,
              uuid: 'story-uuid',
              content: {
                component: 'dynamo_content_fragment',
                fragment: 'missing-uuid',
              },
            },
            rels: [],
          },
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(),
          config: {
            url: '/stories',
            baseURL: 'https://api.storyblok.com/v2/cdn',
          } as InternalAxiosRequestConfig,
        };

        const result = removeUnresolvedResponseInterceptor(response);

        expect(result.data.story.content.fragment).toBeUndefined();
      });

      it('should remove unresolved array relations', () => {
        const mockRelatedStory = {
          id: 2,
          uuid: 'related-uuid',
          name: 'Related Story',
          content: { component: 'fragment' },
        };

        const response: AxiosResponse = {
          data: {
            story: {
              id: 1,
              uuid: 'story-uuid',
              content: {
                component: 'dynamo_content_fragment',
                fragment: ['related-uuid', 'missing-uuid'],
              },
            },
            rels: [mockRelatedStory],
          },
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(),
          config: {
            url: '/stories',
            baseURL: 'https://api.storyblok.com/v2/cdn',
          } as InternalAxiosRequestConfig,
        };

        const result = removeUnresolvedResponseInterceptor(response);

        expect(result.data.story.content.fragment).toEqual([mockRelatedStory]);
      });
    });
  });
});
