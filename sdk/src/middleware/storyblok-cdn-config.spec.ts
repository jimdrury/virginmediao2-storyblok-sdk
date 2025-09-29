import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { AxiosHeaders } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { storyblokCdnConfig } from './storyblok-cdn-config';

describe('storyblokCdnConfig', () => {
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
      const config = { accessToken: 'test-token' };
      const middleware = storyblokCdnConfig(config);

      expect(typeof middleware).toBe('function');
    });

    it('should apply request interceptor for authentication', () => {
      const config = { accessToken: 'test-token' };
      const middleware = storyblokCdnConfig(config);

      middleware(mockAxiosInstance);

      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
      );
    });

    it('should not apply response interceptor when assetDomain is not provided', () => {
      const config = { accessToken: 'test-token' };
      const middleware = storyblokCdnConfig(config);

      middleware(mockAxiosInstance);

      expect(
        mockAxiosInstance.interceptors.response.use,
      ).not.toHaveBeenCalled();
    });

    it('should apply response interceptor when assetDomain is provided', () => {
      const config = {
        accessToken: 'test-token',
        assetDomain: 'https://assets.example.com' as const,
      };
      const middleware = storyblokCdnConfig(config);

      middleware(mockAxiosInstance);

      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
      );
    });
  });

  describe('authentication functionality', () => {
    beforeEach(() => {
      const config = { accessToken: 'test-token' };
      const middleware = storyblokCdnConfig(config);
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

    it('should handle null params', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        params: null,
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({ token: 'test-token' });
    });

    it('should handle complex nested params', () => {
      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        params: {
          filter_query: {
            component: { is: 'blog_post' },
            published: { is: true },
          },
          sort_by: 'created_at',
        },
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({
        filter_query: {
          component: { is: 'blog_post' },
          published: { is: true },
        },
        sort_by: 'created_at',
        token: 'test-token',
      });
    });
  });

  describe('asset domain replacement functionality', () => {
    beforeEach(() => {
      const config = {
        accessToken: 'test-token',
        assetDomain: 'https://assets.example.com' as const,
      };
      const middleware = storyblokCdnConfig(config);
      middleware(mockAxiosInstance);
    });

    it('should replace asset URLs in story response', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            content: {
              image: 'https://a.storyblok.com/f/329767/image.jpg',
              nested: {
                asset: 'https://a.storyblok.com/f/329767/nested.jpg',
              },
            },
          },
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

      expect(result.data.story.content.image).toBe(
        'https://assets.example.com/f/329767/image.jpg',
      );
      expect(result.data.story.content.nested.asset).toBe(
        'https://assets.example.com/f/329767/nested.jpg',
      );
    });

    it('should replace asset URLs in stories response', () => {
      const response: AxiosResponse = {
        data: {
          stories: [
            {
              content: {
                image: 'https://a.storyblok.com/f/329767/image.jpg',
              },
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

      expect(result.data.stories[0].content.image).toBe(
        'https://assets.example.com/f/329767/image.jpg',
      );
    });

    it('should handle asset objects correctly', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            content: {
              featured_image: {
                fieldtype: 'asset',
                filename: 'https://a.storyblok.com/f/329767/image.jpg',
                alt: 'Test image',
                title: 'My image',
              },
            },
          },
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

      expect(result.data.story.content.featured_image.filename).toBe(
        'https://assets.example.com/f/329767/image.jpg',
      );
      expect(result.data.story.content.featured_image.alt).toBe('Test image');
      expect(result.data.story.content.featured_image.title).toBe('My image');
    });

    it('should not process non-Storyblok responses', () => {
      const response: AxiosResponse = {
        data: {
          content: {
            image: 'https://a.storyblok.com/f/329767/image.jpg',
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/other-api',
          headers: new AxiosHeaders(),
        },
      };

      const result = responseInterceptor(response);

      expect(result.data.content.image).toBe(
        'https://a.storyblok.com/f/329767/image.jpg',
      );
    });

    it('should handle arrays of assets', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            content: {
              gallery: [
                'https://a.storyblok.com/f/329767/image1.jpg',
                'https://a.storyblok.com/f/329767/image2.jpg',
              ],
            },
          },
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

      expect(result.data.story.content.gallery[0]).toBe(
        'https://assets.example.com/f/329767/image1.jpg',
      );
      expect(result.data.story.content.gallery[1]).toBe(
        'https://assets.example.com/f/329767/image2.jpg',
      );
    });
  });

  describe('space ID filtering functionality', () => {
    beforeEach(() => {
      const config = {
        accessToken: 'test-token',
        assetDomain: 'https://assets.example.com' as const,
        allowedSpaceIds: ['329767', '123456'] as const,
      };
      const middleware = storyblokCdnConfig(config);
      middleware(mockAxiosInstance);
    });

    it('should process URLs with allowed space IDs', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            content: {
              image: 'https://a.storyblok.com/f/329767/image.jpg',
            },
          },
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

      expect(result.data.story.content.image).toBe(
        'https://assets.example.com/f/329767/image.jpg',
      );
    });

    it('should block URLs with disallowed space IDs', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            content: {
              image: 'https://a.storyblok.com/f/999999/image.jpg',
            },
          },
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

      expect(result.data.story.content.image).toBe('');
    });

    it('should replace blocked asset objects with empty structure', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            content: {
              featured_image: {
                fieldtype: 'asset',
                filename: 'https://a.storyblok.com/f/999999/image.jpg',
                alt: 'Test image',
                title: 'My image',
              },
            },
          },
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

      expect(result.data.story.content.featured_image).toEqual({
        id: null,
        alt: null,
        name: '',
        focus: null,
        title: null,
        filename: null,
        copyright: null,
        fieldtype: 'asset',
        meta_data: {},
        is_external_url: false,
        source: null,
      });
    });

    it('should handle mixed allowed and blocked URLs', () => {
      const response: AxiosResponse = {
        data: {
          story: {
            content: {
              allowed_image: 'https://a.storyblok.com/f/329767/allowed.jpg',
              blocked_image: 'https://a.storyblok.com/f/999999/blocked.jpg',
            },
          },
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

      expect(result.data.story.content.allowed_image).toBe(
        'https://assets.example.com/f/329767/allowed.jpg',
      );
      expect(result.data.story.content.blocked_image).toBe('');
    });
  });

  describe('error handling', () => {
    it('should handle request interceptor errors', () => {
      const config = { accessToken: 'test-token' };
      const middleware = storyblokCdnConfig(config);
      middleware(mockAxiosInstance);

      const errorHandler = (
        mockAxiosInstance.interceptors.request.use as ReturnType<typeof vi.fn>
      ).mock.calls[0][1];
      const testError = new Error('Test error');

      return expect(errorHandler(testError)).rejects.toThrow('Test error');
    });

    it('should handle response interceptor errors when assetDomain is provided', () => {
      const config = {
        accessToken: 'test-token',
        assetDomain: 'https://assets.example.com' as const,
      };
      const middleware = storyblokCdnConfig(config);
      middleware(mockAxiosInstance);

      const errorHandler = (
        mockAxiosInstance.interceptors.response.use as ReturnType<typeof vi.fn>
      ).mock.calls[0][1];
      const testError = new Error('Test error');

      return expect(errorHandler(testError)).rejects.toThrow('Test error');
    });

    it('should handle malformed response data gracefully', () => {
      const config = {
        accessToken: 'test-token',
        assetDomain: 'https://assets.example.com' as const,
      };
      const middleware = storyblokCdnConfig(config);
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

      const result = responseInterceptor(response);

      expect(result.data).toBe(null);
    });

    it('should handle circular references gracefully', () => {
      const config = {
        accessToken: 'test-token',
        assetDomain: 'https://assets.example.com' as const,
      };
      const middleware = storyblokCdnConfig(config);
      middleware(mockAxiosInstance);

      const response: AxiosResponse = {
        data: {
          story: {
            content: {
              image: 'https://a.storyblok.com/f/329767/image.jpg',
            },
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/stories/test',
          headers: new AxiosHeaders(),
        },
      };

      // This should not throw an error for normal objects
      expect(() => responseInterceptor(response)).not.toThrow();
    });
  });

  describe('integration scenarios', () => {
    it('should work with different access tokens', () => {
      const config = { accessToken: 'different-token-123' };
      const middleware = storyblokCdnConfig(config);
      middleware(mockAxiosInstance);

      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({ token: 'different-token-123' });
    });

    it('should work with different asset domains', () => {
      const config = {
        accessToken: 'test-token',
        assetDomain: 'https://cdn.mycompany.com' as const,
      };
      const middleware = storyblokCdnConfig(config);
      middleware(mockAxiosInstance);

      const response: AxiosResponse = {
        data: {
          story: {
            content: {
              image: 'https://a.storyblok.com/f/329767/image.jpg',
            },
          },
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

      expect(result.data.story.content.image).toBe(
        'https://cdn.mycompany.com/f/329767/image.jpg',
      );
    });

    it('should be idempotent when applied multiple times', () => {
      const config = { accessToken: 'test-token' };
      const middleware = storyblokCdnConfig(config);

      middleware(mockAxiosInstance);
      middleware(mockAxiosInstance);
      middleware(mockAxiosInstance);

      const requestConfig: InternalAxiosRequestConfig = {
        url: '/stories',
        headers: new AxiosHeaders(),
      };

      const result = requestInterceptor(requestConfig);

      expect(result.params).toEqual({ token: 'test-token' });
    });

    it('should handle nested asset objects in complex structures', () => {
      const config = {
        accessToken: 'test-token',
        assetDomain: 'https://assets.example.com' as const,
      };
      const middleware = storyblokCdnConfig(config);
      middleware(mockAxiosInstance);

      const response: AxiosResponse = {
        data: {
          stories: [
            {
              content: {
                sections: [
                  {
                    component: 'hero',
                    background: {
                      fieldtype: 'asset',
                      filename: 'https://a.storyblok.com/f/329767/hero-bg.jpg',
                      alt: 'Hero background',
                    },
                    items: [
                      {
                        image: {
                          fieldtype: 'asset',
                          filename:
                            'https://a.storyblok.com/f/329767/item-image.jpg',
                          alt: 'Item image',
                        },
                      },
                    ],
                  },
                ],
              },
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

      expect(
        result.data.stories[0].content.sections[0].background.filename,
      ).toBe('https://assets.example.com/f/329767/hero-bg.jpg');
      expect(
        result.data.stories[0].content.sections[0].items[0].image.filename,
      ).toBe('https://assets.example.com/f/329767/item-image.jpg');
    });

    it('should handle non-asset URLs that contain a.storyblok.com', () => {
      const config = {
        accessToken: 'test-token',
        assetDomain: 'https://assets.example.com' as const,
      };
      const middleware = storyblokCdnConfig(config);
      middleware(mockAxiosInstance);

      const response: AxiosResponse = {
        data: {
          story: {
            content: {
              description: 'Visit https://a.storyblok.com for more info',
              link: 'https://a.storyblok.com/f/329767/document.pdf',
              non_asset_field: 'regular text',
            },
          },
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

      expect(result.data.story.content.description).toBe(
        'Visit https://assets.example.com for more info',
      );
      expect(result.data.story.content.link).toBe(
        'https://assets.example.com/f/329767/document.pdf',
      );
      expect(result.data.story.content.non_asset_field).toBe('regular text');
    });

    it('should handle URLs without protocol', () => {
      const config = {
        accessToken: 'test-token',
        assetDomain: 'https://assets.example.com' as const,
      };
      const middleware = storyblokCdnConfig(config);
      middleware(mockAxiosInstance);

      const response: AxiosResponse = {
        data: {
          story: {
            content: {
              image: 'http://a.storyblok.com/f/329767/image.jpg', // http instead of https
              asset: {
                fieldtype: 'asset',
                filename: 'http://a.storyblok.com/f/329767/asset.jpg',
                alt: 'Test asset',
              },
            },
          },
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

      expect(result.data.story.content.image).toBe(
        'https://assets.example.com/f/329767/image.jpg',
      );
      expect(result.data.story.content.asset.filename).toBe(
        'https://assets.example.com/f/329767/asset.jpg',
      );
    });

    it('should handle empty and null values in response data', () => {
      const config = {
        accessToken: 'test-token',
        assetDomain: 'https://assets.example.com' as const,
      };
      const middleware = storyblokCdnConfig(config);
      middleware(mockAxiosInstance);

      const response: AxiosResponse = {
        data: {
          story: {
            content: {
              image: null,
              description: '',
              asset: {
                fieldtype: 'asset',
                filename: null,
                alt: undefined,
              },
              items: [],
            },
          },
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
      expect(response.data.story.content.image).toBe(null);
      expect(response.data.story.content.description).toBe('');
      expect(response.data.story.content.items).toEqual([]);
    });
  });
});
