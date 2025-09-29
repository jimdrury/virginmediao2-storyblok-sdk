import axios, { type AxiosInstance } from 'axios';
import { beforeEach, describe, expect, it } from 'vitest';
import { storyblokCdnDomain } from './storyblok-cdn-domain';

describe('storyblokCdnDomain', () => {
  let axiosInstance: AxiosInstance;
  let middleware: (axiosInstance: AxiosInstance) => void;

  beforeEach(() => {
    axiosInstance = axios.create({
      baseURL: 'https://api.storyblok.com/v2/cdn',
    });
    middleware = storyblokCdnDomain({
      assetDomain: 'https://assets.example.com',
    });
    middleware(axiosInstance);
  });

  describe('response processing', () => {
    it('should replace a.storyblok.com URLs in story content', () => {
      const mockResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'story-1',
            name: 'Test Story',
            slug: 'test-story',
            full_slug: 'test-story',
            content: {
              image: 'https://a.storyblok.com/f/123456/image.jpg',
              gallery: [
                'https://a.storyblok.com/f/123457/image1.jpg',
                'https://a.storyblok.com/f/123458/image2.jpg',
              ],
              nested: {
                background: 'https://a.storyblok.com/f/123459/bg.jpg',
              },
            },
          },
          cv: 1,
          rels: [],
          links: [],
        },
        config: {
          url: '/stories/test-story',
        },
      };

      const responseInterceptor =
        axiosInstance.interceptors.response.handlers[0];
      const result = responseInterceptor.fulfilled(mockResponse);

      expect(result.data.story.content.image).toBe(
        'https://assets.example.com/f/123456/image.jpg',
      );
      expect(result.data.story.content.gallery[0]).toBe(
        'https://assets.example.com/f/123457/image1.jpg',
      );
      expect(result.data.story.content.gallery[1]).toBe(
        'https://assets.example.com/f/123458/image2.jpg',
      );
      expect(result.data.story.content.nested.background).toBe(
        'https://assets.example.com/f/123459/bg.jpg',
      );
    });

    it('should process asset objects correctly', () => {
      const mockResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'story-1',
            name: 'Asset Object Test',
            slug: 'asset-object-test',
            full_slug: 'asset-object-test',
            content: {
              hero_image: {
                id: 123456,
                alt: 'Hero image',
                name: 'hero.jpg',
                focus: 'center',
                title: 'Hero Image',
                filename: 'https://a.storyblok.com/f/123456/hero.jpg',
                copyright: '© 2023',
                fieldtype: 'asset',
                meta_data: { width: 1920, height: 1080 },
                is_external_url: false,
              },
            },
          },
          cv: 1,
          rels: [],
          links: [],
        },
        config: {
          url: '/stories/asset-object-test',
        },
      };

      const responseInterceptor =
        axiosInstance.interceptors.response.handlers[0];
      const result = responseInterceptor.fulfilled(mockResponse);

      expect(result.data.story.content.hero_image.filename).toBe(
        'https://assets.example.com/f/123456/hero.jpg',
      );
      expect(result.data.story.content.hero_image.id).toBe(123456);
      expect(result.data.story.content.hero_image.alt).toBe('Hero image');
      expect(result.data.story.content.hero_image.fieldtype).toBe('asset');
    });

    it('should replace blocked asset objects with empty asset structure', () => {
      const middlewareWithSpaceFilter = storyblokCdnDomain({
        assetDomain: 'https://assets.example.com',
        allowedSpaceIds: ['329767'],
      });
      const newAxiosInstance = axios.create({
        baseURL: 'https://api.storyblok.com/v2/cdn',
      });
      middlewareWithSpaceFilter(newAxiosInstance);

      const mockResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'story-1',
            name: 'Blocked Asset Object Test',
            slug: 'blocked-asset-test',
            full_slug: 'blocked-asset-test',
            content: {
              hero_image: {
                id: 123456,
                alt: 'Hero image',
                name: 'hero.jpg',
                focus: 'center',
                title: 'Hero Image',
                filename: 'https://a.storyblok.com/f/999999/hero.jpg', // Blocked space ID
                copyright: '© 2023',
                fieldtype: 'asset',
                meta_data: { width: 1920, height: 1080 },
                is_external_url: false,
              },
            },
          },
          cv: 1,
          rels: [],
          links: [],
        },
        config: {
          url: '/stories/blocked-asset-test',
        },
      };

      const responseInterceptor =
        newAxiosInstance.interceptors.response.handlers[0];
      const result = responseInterceptor.fulfilled(mockResponse);

      expect(result.data.story.content.hero_image).toEqual({
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

    it('should replace a.storyblok.com URLs in rels', () => {
      const mockResponse = {
        data: {
          stories: [],
          rels: [
            {
              id: 1,
              uuid: 'story-1',
              name: 'Related Story',
              slug: 'related-story',
              full_slug: 'related-story',
              content: {
                hero_image: 'https://a.storyblok.com/f/123460/hero.jpg',
                assets: [
                  'https://a.storyblok.com/f/123461/asset1.jpg',
                  'https://a.storyblok.com/f/123462/asset2.jpg',
                ],
              },
            },
          ],
          cv: 1,
          links: [],
        },
        config: {
          url: '/stories',
        },
      };

      const responseInterceptor =
        axiosInstance.interceptors.response.handlers[0];
      const result = responseInterceptor.fulfilled(mockResponse);

      expect(result.data.rels[0].content.hero_image).toBe(
        'https://assets.example.com/f/123460/hero.jpg',
      );
      expect(result.data.rels[0].content.assets[0]).toBe(
        'https://assets.example.com/f/123461/asset1.jpg',
      );
      expect(result.data.rels[0].content.assets[1]).toBe(
        'https://assets.example.com/f/123462/asset2.jpg',
      );
    });

    it('should handle mixed content with some a.storyblok.com URLs', () => {
      const mockResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'story-1',
            name: 'Mixed Content Story',
            slug: 'mixed-story',
            full_slug: 'mixed-story',
            content: {
              local_image: '/local/image.jpg',
              storyblok_image: 'https://a.storyblok.com/f/123463/storyblok.jpg',
              external_image: 'https://example.com/image.jpg',
              mixed_array: [
                '/local/array1.jpg',
                'https://a.storyblok.com/f/123464/array2.jpg',
                'https://other-cdn.com/image.jpg',
              ],
            },
          },
          cv: 1,
          rels: [],
          links: [],
        },
        config: {
          url: '/stories/mixed-story',
        },
      };

      const responseInterceptor =
        axiosInstance.interceptors.response.handlers[0];
      const result = responseInterceptor.fulfilled(mockResponse);

      expect(result.data.story.content.local_image).toBe('/local/image.jpg');
      expect(result.data.story.content.storyblok_image).toBe(
        'https://assets.example.com/f/123463/storyblok.jpg',
      );
      expect(result.data.story.content.external_image).toBe(
        'https://example.com/image.jpg',
      );
      expect(result.data.story.content.mixed_array[0]).toBe(
        '/local/array1.jpg',
      );
      expect(result.data.story.content.mixed_array[1]).toBe(
        'https://assets.example.com/f/123464/array2.jpg',
      );
      expect(result.data.story.content.mixed_array[2]).toBe(
        'https://other-cdn.com/image.jpg',
      );
    });

    it('should handle URLs with different protocols', () => {
      const mockResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'story-1',
            name: 'Protocol Test Story',
            slug: 'protocol-test',
            full_slug: 'protocol-test',
            content: {
              http_image: 'http://a.storyblok.com/f/123465/http.jpg',
              https_image: 'https://a.storyblok.com/f/123466/https.jpg',
            },
          },
          cv: 1,
          rels: [],
          links: [],
        },
        config: {
          url: '/stories/protocol-test',
        },
      };

      const responseInterceptor =
        axiosInstance.interceptors.response.handlers[0];
      const result = responseInterceptor.fulfilled(mockResponse);

      expect(result.data.story.content.http_image).toBe(
        'https://assets.example.com/f/123465/http.jpg',
      );
      expect(result.data.story.content.https_image).toBe(
        'https://assets.example.com/f/123466/https.jpg',
      );
    });

    it('should not process non-Storyblok responses', () => {
      const mockResponse = {
        data: { someOtherData: 'value' },
        config: {
          url: '/other-endpoint',
        },
      };

      const responseInterceptor =
        axiosInstance.interceptors.response.handlers[0];
      const result = responseInterceptor.fulfilled(mockResponse);

      expect(result).toBe(mockResponse);
    });

    it('should handle responses without content', () => {
      const mockResponse = {
        data: {
          stories: [],
          cv: 1,
          rels: [],
          links: [],
        },
        config: {
          url: '/stories',
        },
      };

      const responseInterceptor =
        axiosInstance.interceptors.response.handlers[0];
      const result = responseInterceptor.fulfilled(mockResponse);

      expect(result.data).toEqual(mockResponse.data);
    });

    it('should handle null and undefined values gracefully', () => {
      const mockResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'story-1',
            name: 'Null Test Story',
            slug: 'null-test',
            full_slug: 'null-test',
            content: {
              null_image: null,
              undefined_image: undefined,
              empty_string: '',
              valid_image: 'https://a.storyblok.com/f/123467/valid.jpg',
            },
          },
          cv: 1,
          rels: [],
          links: [],
        },
        config: {
          url: '/stories/null-test',
        },
      };

      const responseInterceptor =
        axiosInstance.interceptors.response.handlers[0];
      const result = responseInterceptor.fulfilled(mockResponse);

      expect(result.data.story.content.null_image).toBeNull();
      expect(result.data.story.content.undefined_image).toBeUndefined();
      expect(result.data.story.content.empty_string).toBe('');
      expect(result.data.story.content.valid_image).toBe(
        'https://assets.example.com/f/123467/valid.jpg',
      );
    });

    it('should filter URLs by space ID when allowedSpaceIds is provided', () => {
      const middlewareWithSpaceFilter = storyblokCdnDomain({
        assetDomain: 'https://assets.example.com',
        allowedSpaceIds: ['329767', '123456'],
      });
      const newAxiosInstance = axios.create({
        baseURL: 'https://api.storyblok.com/v2/cdn',
      });
      middlewareWithSpaceFilter(newAxiosInstance);

      const mockResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'story-1',
            name: 'Space ID Filter Test',
            slug: 'space-filter-test',
            full_slug: 'space-filter-test',
            content: {
              allowed_image: 'https://a.storyblok.com/f/329767/allowed.jpg',
              another_allowed: 'https://a.storyblok.com/f/123456/another.jpg',
              blocked_image: 'https://a.storyblok.com/f/999999/blocked.jpg',
              non_storyblok: 'https://example.com/image.jpg',
              local_image: '/local/image.jpg',
            },
          },
          cv: 1,
          rels: [],
          links: [],
        },
        config: {
          url: '/stories/space-filter-test',
        },
      };

      const responseInterceptor =
        newAxiosInstance.interceptors.response.handlers[0];
      const result = responseInterceptor.fulfilled(mockResponse);

      expect(result.data.story.content.allowed_image).toBe(
        'https://assets.example.com/f/329767/allowed.jpg',
      );
      expect(result.data.story.content.another_allowed).toBe(
        'https://assets.example.com/f/123456/another.jpg',
      );
      expect(result.data.story.content.blocked_image).toBe('');
      expect(result.data.story.content.non_storyblok).toBe(
        'https://example.com/image.jpg',
      );
      expect(result.data.story.content.local_image).toBe('/local/image.jpg');
    });

    it('should handle empty allowedSpaceIds array', () => {
      const middlewareWithEmptySpaceFilter = storyblokCdnDomain({
        assetDomain: 'https://assets.example.com',
        allowedSpaceIds: [],
      });
      const newAxiosInstance = axios.create({
        baseURL: 'https://api.storyblok.com/v2/cdn',
      });
      middlewareWithEmptySpaceFilter(newAxiosInstance);

      const mockResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'story-1',
            name: 'Empty Space Filter Test',
            slug: 'empty-space-filter-test',
            full_slug: 'empty-space-filter-test',
            content: {
              image: 'https://a.storyblok.com/f/329767/image.jpg',
            },
          },
          cv: 1,
          rels: [],
          links: [],
        },
        config: {
          url: '/stories/empty-space-filter-test',
        },
      };

      const responseInterceptor =
        newAxiosInstance.interceptors.response.handlers[0];
      const result = responseInterceptor.fulfilled(mockResponse);

      // Should process normally when allowedSpaceIds is empty
      expect(result.data.story.content.image).toBe(
        'https://assets.example.com/f/329767/image.jpg',
      );
    });

    it('should handle URLs without space ID in path', () => {
      const middlewareWithSpaceFilter = storyblokCdnDomain({
        assetDomain: 'https://assets.example.com',
        allowedSpaceIds: ['329767'],
      });
      const newAxiosInstance = axios.create({
        baseURL: 'https://api.storyblok.com/v2/cdn',
      });
      middlewareWithSpaceFilter(newAxiosInstance);

      const mockResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'story-1',
            name: 'No Space ID Test',
            slug: 'no-space-id-test',
            full_slug: 'no-space-id-test',
            content: {
              // URL without space ID in the expected format
              malformed_url: 'https://a.storyblok.com/f/image.jpg',
            },
          },
          cv: 1,
          rels: [],
          links: [],
        },
        config: {
          url: '/stories/no-space-id-test',
        },
      };

      const responseInterceptor =
        newAxiosInstance.interceptors.response.handlers[0];
      const result = responseInterceptor.fulfilled(mockResponse);

      // Should be set to empty string because space ID cannot be extracted
      expect(result.data.story.content.malformed_url).toBe('');
    });

    it('should work without allowedSpaceIds (backward compatibility)', () => {
      const middlewareWithoutSpaceFilter = storyblokCdnDomain({
        assetDomain: 'https://assets.example.com',
      });
      const newAxiosInstance = axios.create({
        baseURL: 'https://api.storyblok.com/v2/cdn',
      });
      middlewareWithoutSpaceFilter(newAxiosInstance);

      const mockResponse = {
        data: {
          story: {
            id: 1,
            uuid: 'story-1',
            name: 'No Space Filter Test',
            slug: 'no-space-filter-test',
            full_slug: 'no-space-filter-test',
            content: {
              image: 'https://a.storyblok.com/f/329767/image.jpg',
            },
          },
          cv: 1,
          rels: [],
          links: [],
        },
        config: {
          url: '/stories/no-space-filter-test',
        },
      };

      const responseInterceptor =
        newAxiosInstance.interceptors.response.handlers[0];
      const result = responseInterceptor.fulfilled(mockResponse);

      // Should process normally without space ID filtering
      expect(result.data.story.content.image).toBe(
        'https://assets.example.com/f/329767/image.jpg',
      );
    });
  });

  describe('error handling', () => {
    it('should pass through response errors', () => {
      const error = new Error('Response failed');
      const responseInterceptor =
        axiosInstance.interceptors.response.handlers[0];

      expect(() => responseInterceptor.rejected(error)).rejects.toThrow(
        'Response failed',
      );
    });
  });
});
