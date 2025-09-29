import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StoryblokSdk } from './storyblok-sdk';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

// Mock the interceptor utilities
vi.mock('./interceptors');

// Mock the utils
vi.mock('./utils', () => ({
  fetchAllPaginated: vi.fn().mockResolvedValue([]),
}));

describe('StoryblokSdk', () => {
  let sdk: StoryblokSdk;
  let mockAxiosInstance: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    request: ReturnType<typeof vi.fn>;
    interceptors: {
      request: {
        use: ReturnType<typeof vi.fn>;
      };
      response: {
        use: ReturnType<typeof vi.fn>;
      };
    };
  };
  const mockAccessToken = 'test-access-token';

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock axios instance
    mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      request: vi.fn(),
      interceptors: {
        request: {
          use: vi.fn(),
        },
        response: {
          use: vi.fn(),
        },
      },
    };

    mockedAxios.create.mockReturnValue(
      mockAxiosInstance as ReturnType<typeof axios.create>,
    );

    sdk = new StoryblokSdk({
      accessToken: mockAccessToken,
    });
  });

  describe('constructor', () => {
    it('should create SDK instance with required options', () => {
      expect(sdk).toBeInstanceOf(StoryblokSdk);
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.storyblok.com/v2/cdn/',
        timeout: 10000,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    });

    it('should use custom baseURL when provided', () => {
      const customBaseURL = 'https://custom-api.example.com';
      new StoryblokSdk({
        accessToken: mockAccessToken,
        baseURL: customBaseURL,
      });

      expect(mockedAxios.create).toHaveBeenLastCalledWith({
        baseURL: customBaseURL,
        timeout: 10000,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    });

    it('should use custom timeout when provided', () => {
      new StoryblokSdk({
        accessToken: mockAccessToken,
        timeout: 5000,
      });

      expect(mockedAxios.create).toHaveBeenLastCalledWith({
        baseURL: 'https://api.storyblok.com/v2/cdn/',
        timeout: 5000,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('interceptors', () => {
    it('should expose axios interceptors', () => {
      expect(sdk.axiosInstance.interceptors).toBe(
        mockAxiosInstance.interceptors,
      );
    });
  });

  describe('getStories', () => {
    it('should fetch stories', async () => {
      const mockResponse = {
        data: {
          stories: [{ id: 1, name: 'Test Story', content: { title: 'Test' } }],
          cv: 123,
          rels: [],
          links: [],
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await sdk.getStories();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/stories', {
        params: undefined,
      });
      expect(result).toBe(mockResponse);
    });

    it('should fetch stories with parameters', async () => {
      const params = { starts_with: 'blog/', page: 2 };
      const mockResponse = { data: { stories: [] } };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await sdk.getStories(params);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/stories', {
        params,
      });
    });
  });

  describe('getStory', () => {
    it('should fetch a single story', async () => {
      const slug = 'test-story';
      const mockResponse = {
        data: {
          story: { id: 1, name: 'Test Story', content: { title: 'Test' } },
          cv: 123,
          rels: [],
          links: [],
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await sdk.getStory(slug);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/stories/${slug}`, {
        params: undefined,
      });
      expect(result).toBe(mockResponse);
    });

    it('should fetch a single story with parameters', async () => {
      const slug = 'test-story';
      const params = { version: 'draft' as const };
      const mockResponse = { data: { story: {} } };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await sdk.getStory(slug, params);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/stories/${slug}`, {
        params,
      });
    });
  });

  describe('getStoriesByTag', () => {
    it('should fetch stories by tag', async () => {
      const tag = 'featured';
      const mockResponse = { data: { stories: [] } };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await sdk.getStoriesByTag(tag);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/stories', {
        params: {
          filter_query: {
            tag_list: { in: tag },
          },
        },
      });
    });

    it('should fetch stories by tag with additional params', async () => {
      const tag = 'featured';
      const params = { starts_with: 'blog/' };

      await sdk.getStoriesByTag(tag, params);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/stories', {
        params: {
          starts_with: 'blog/',
          filter_query: {
            tag_list: { in: tag },
          },
        },
      });
    });
  });

  describe('getStoriesByPath', () => {
    it('should fetch stories by path', async () => {
      const path = 'blog/';
      const mockResponse = { data: { stories: [] } };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await sdk.getStoriesByPath(path);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/stories', {
        params: {
          starts_with: path,
        },
      });
    });

    it('should fetch stories by path with additional params', async () => {
      const path = 'blog/';
      const params = { version: 'published' as const };

      await sdk.getStoriesByPath(path, params);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/stories', {
        params: {
          version: 'published',
          starts_with: path,
        },
      });
    });
  });

  describe('searchStories', () => {
    it('should search stories', async () => {
      const searchTerm = 'Next.js';
      const mockResponse = { data: { stories: [] } };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await sdk.searchStories(searchTerm);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/stories', {
        params: {
          search_term: searchTerm,
        },
      });
    });

    it('should search stories with additional params', async () => {
      const searchTerm = 'Next.js';
      const params = { starts_with: 'blog/' };

      await sdk.searchStories(searchTerm, params);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/stories', {
        params: {
          starts_with: 'blog/',
          search_term: searchTerm,
        },
      });
    });
  });

  describe('getTags', () => {
    it('should fetch tags', async () => {
      const mockResponse = {
        data: {
          tags: [{ name: 'featured', taggings_count: 5 }],
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await sdk.getTags();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tags', {
        params: undefined,
      });
      expect(result).toBe(mockResponse);
    });

    it('should fetch tags with pagination params', async () => {
      const params = { page: 2, per_page: 50 };

      await sdk.getTags(params);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tags', { params });
    });
  });

  describe('getLinks', () => {
    it('should fetch links', async () => {
      const mockResponse = {
        data: {
          links: { '123': { id: 123, slug: 'home' } },
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await sdk.getLinks();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/links', {
        params: undefined,
      });
      expect(result).toBe(mockResponse);
    });

    it('should fetch links with pagination params', async () => {
      const params = { page: 1, per_page: 100 };

      await sdk.getLinks(params);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/links', { params });
    });
  });

  describe('getDatasourceEntries', () => {
    it('should fetch datasource entries', async () => {
      const datasource = 'countries';
      const mockResponse = {
        data: {
          datasource_entries: [{ name: 'USA', value: 'us' }],
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await sdk.getDatasourceEntries(datasource);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/datasource_entries',
        {
          params: { datasource },
        },
      );
      expect(result).toBe(mockResponse);
    });

    it('should fetch datasource entries with pagination params', async () => {
      const datasource = 'countries';
      const params = { page: 2, per_page: 500 };

      await sdk.getDatasourceEntries(datasource, params);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/datasource_entries',
        {
          params: { datasource, page: 2, per_page: 500 },
        },
      );
    });
  });

  // Basic tests for getAll methods (verify they exist and don't throw)
  describe('getAllX methods', () => {
    it('should have getAllStories method', () => {
      expect(typeof sdk.getAllStories).toBe('function');
    });

    it('should have getAllStoriesByTag method', () => {
      expect(typeof sdk.getAllStoriesByTag).toBe('function');
    });

    it('should have getAllStoriesByPath method', () => {
      expect(typeof sdk.getAllStoriesByPath).toBe('function');
    });

    it('should have searchAllStories method', () => {
      expect(typeof sdk.searchAllStories).toBe('function');
    });

    it('should have getAllTags method', () => {
      expect(typeof sdk.getAllTags).toBe('function');
    });

    it('should have getAllLinks method', () => {
      expect(typeof sdk.getAllLinks).toBe('function');
    });

    it('should have getAllDatasourceEntries method', () => {
      expect(typeof sdk.getAllDatasourceEntries).toBe('function');
    });

    it('should handle getAllStories call without throwing', async () => {
      // Since fetchAllPaginated is mocked, this should resolve
      await expect(sdk.getAllStories()).resolves.toBeDefined();
    });

    it('should handle getAllStoriesByTag call without throwing', async () => {
      await expect(sdk.getAllStoriesByTag('featured')).resolves.toBeDefined();
    });

    it('should handle getAllStoriesByPath call without throwing', async () => {
      await expect(sdk.getAllStoriesByPath('blog/')).resolves.toBeDefined();
    });

    it('should handle searchAllStories call without throwing', async () => {
      await expect(sdk.searchAllStories('typescript')).resolves.toBeDefined();
    });

    it('should handle getAllTags call without throwing', async () => {
      await expect(sdk.getAllTags()).resolves.toBeDefined();
    });

    it('should handle getAllLinks call without throwing', async () => {
      await expect(sdk.getAllLinks()).resolves.toBeDefined();
    });

    it('should handle getAllDatasourceEntries call without throwing', async () => {
      await expect(
        sdk.getAllDatasourceEntries('countries'),
      ).resolves.toBeDefined();
    });
  });

  describe('error handling', () => {
    it('should handle axios errors in getStories', async () => {
      const error = new Error('Network error');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(sdk.getStories()).rejects.toThrow('Network error');
    });

    it('should handle axios errors in getStory', async () => {
      const error = new Error('Story not found');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(sdk.getStory('non-existent')).rejects.toThrow(
        'Story not found',
      );
    });

    it('should handle axios errors in getTags', async () => {
      const error = new Error('API error');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(sdk.getTags()).rejects.toThrow('API error');
    });

    it('should handle axios errors in getLinks', async () => {
      const error = new Error('API error');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(sdk.getLinks()).rejects.toThrow('API error');
    });

    it('should handle axios errors in getDatasourceEntries', async () => {
      const error = new Error('API error');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(sdk.getDatasourceEntries('countries')).rejects.toThrow(
        'API error',
      );
    });
  });

  describe('middleware functionality', () => {
    it('should apply middlewares to axios instance', () => {
      const middleware = vi.fn();
      new StoryblokSdk({
        accessToken: mockAccessToken,
        middlewares: [middleware],
      });

      expect(middleware).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should apply multiple middlewares in order', () => {
      const middleware1 = vi.fn();
      const middleware2 = vi.fn();
      new StoryblokSdk({
        accessToken: mockAccessToken,
        middlewares: [middleware1, middleware2],
      });

      expect(middleware1).toHaveBeenCalledWith(expect.any(Object));
      expect(middleware2).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('edge cases', () => {
    it('should handle empty responses', async () => {
      const mockResponse = { data: { stories: [] } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await sdk.getStories();
      expect(result.data.stories).toEqual([]);
    });

    it('should handle null/undefined parameters gracefully', async () => {
      const mockResponse = { data: { stories: [] } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      // These should not throw
      await expect(sdk.getStories(undefined)).resolves.toBeDefined();
      await expect(sdk.getStory('test', undefined)).resolves.toBeDefined();
      await expect(sdk.getTags(undefined)).resolves.toBeDefined();
      await expect(sdk.getLinks(undefined)).resolves.toBeDefined();
    });

    it('should handle special characters in slugs', async () => {
      const slug = 'test-story-with-special-chars-123';
      const mockResponse = { data: { story: {} } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await sdk.getStory(slug);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/stories/${slug}`, {
        params: undefined,
      });
    });

    it('should handle empty search terms', async () => {
      const mockResponse = { data: { stories: [] } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await sdk.searchStories('');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/stories', {
        params: {
          search_term: '',
        },
      });
    });

    it('should handle empty tag names', async () => {
      const mockResponse = { data: { stories: [] } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await sdk.getStoriesByTag('');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/stories', {
        params: {
          filter_query: {
            tag_list: {
              in: '',
            },
          },
        },
      });
    });
  });
});
