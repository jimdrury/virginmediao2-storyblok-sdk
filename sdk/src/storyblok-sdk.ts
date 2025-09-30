import axios, { type AxiosInstance } from 'axios';
import type {
  BaseStoryblokOptions,
  BlokType,
  GetLinksParams,
  GetStoriesParams,
  GetStoryParams,
  StoryblokDatasourceEntriesResponse,
  StoryblokLinksResponse,
  StoryblokStoriesResponse,
  StoryblokStoryResponse,
  StoryblokTagsResponse,
} from './types';
import { fetchAllPaginated } from './utils';

/**
 * Storyblok SDK for content delivery API
 *
 * Provides access to published and draft content from Storyblok CMS.
 * This SDK supports both published and draft content retrieval with
 * automatic pagination handling and filtering capabilities.
 *
 * @example
 * ```typescript
 * import { StoryblokSdk } from '@virginmediao2/storyblok-sdk';
 *
 * const sdk = new StoryblokSdk({
 *   accessToken: 'your-access-token',
 *   baseURL: 'https://api.storyblok.com/v2'
 * });
 *
 * // Get all stories
 * const stories = await sdk.getAllStories();
 *
 * // Get stories by tag
 * const taggedStories = await sdk.getAllStoriesByTag('featured');
 * ```
 */
export class StoryblokSdk {
  public axiosInstance: AxiosInstance;
  private baseURL: string;

  /**
   * Creates a new Storyblok SDK instance
   *
   * @param options - Configuration options for the SDK
   * @param options.baseURL - Base URL for the Storyblok API (defaults to 'https://api.storyblok.com/v2')
   * @param options.timeout - Request timeout in milliseconds (defaults to 10000)
   *
   * @example
   * ```typescript
   * const sdk = new StoryblokSdk({
   *   accessToken: 'your-access-token',
   *   baseURL: 'https://api.storyblok.com/v2',
   *   timeout: 15000,
   *   retry: {
   *     retries: 3,
   *     retryDelay: 1000
   *   }
   * });
   * ```
   */
  constructor(options: BaseStoryblokOptions) {
    this.baseURL = options.baseURL || 'https://api.storyblok.com/v2/cdn/';

    // Create axios instance with default configuration
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: options.timeout || 10000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    options.middlewares?.forEach((middleware) => {
      middleware(this.axiosInstance);
    });
  }

  /**
   * Get multiple stories with optional filtering and pagination
   *
   * Retrieves stories from Storyblok with support for filtering, sorting,
   * and pagination. This method returns a single page of results.
   *
   * @param params - Optional parameters for filtering and pagination
   * @param params.page - Page number (defaults to 1)
   * @param params.per_page - Number of stories per page (max 100)
   * @param params.filter_query - Filter stories by various criteria
   * @param params.starts_with - Filter stories that start with a specific path
   * @param params.search_term - Search for stories containing specific text
   * @param params.sort_by - Sort stories by field (e.g., 'created_at', 'name')
   *
   * @returns Promise resolving to stories response with pagination info
   *
   * @example
   * ```typescript
   * // Get first page of stories
   * const response = await sdk.getStories();
   *
   * // Get stories with filtering
   * const filteredStories = await sdk.getStories({
   *   starts_with: 'blog/',
   *   per_page: 10,
   *   sort_by: 'created_at',
   *   sort_direction: 'desc'
   * });
   *
   * // Search stories
   * const searchResults = await sdk.getStories({
   *   search_term: 'typescript',
   *   per_page: 20
   * });
   * ```
   */
  async getStories<T extends BlokType = BlokType>(params?: GetStoriesParams) {
    return await this.axiosInstance.get<StoryblokStoriesResponse<T>>(
      '/stories',
      {
        params,
      },
    );
  }

  /**
   * Get all stories with automatic pagination handling
   * This will fetch all stories across multiple pages using Storyblok's pagination system
   *
   * @see https://www.storyblok.com/docs/api/content-delivery/v2/getting-started/pagination
   */
  async getAllStories<T extends BlokType = BlokType>(
    params?: Omit<GetStoriesParams, 'page' | 'per_page'>,
    options?: {
      perPage?: number;
      maxPages?: number;
      onProgress?: (page: number, totalFetched: number, total?: number) => void;
    },
  ) {
    return fetchAllPaginated(
      (page, perPage) =>
        this.getStories<T>({ ...params, page, per_page: perPage }),
      (response) =>
        response.stories.map((story) => ({
          id: story.id,
          name: story.name,
          slug: story.slug,
          full_slug: story.full_slug,
          content: story.content,
        })),
      options,
    );
  }

  /**
   * Get a single story by slug or UUID
   *
   * @param slug - The story slug or UUID
   * @param params - Optional parameters
   * @param params.find_by - Set to "uuid" when slug parameter is actually a UUID
   */
  async getStory<T extends BlokType = BlokType>(
    slug: string,
    params?: GetStoryParams,
  ) {
    return await this.axiosInstance.get<StoryblokStoryResponse<T>>(
      `/stories/${slug}`,
      {
        params,
      },
    );
  }

  /**
   * Get stories by tag
   */
  async getStoriesByTag<T extends BlokType = BlokType>(
    tag: string,
    params?: Omit<GetStoriesParams, 'filter_query'>,
  ) {
    return this.getStories<T>({
      ...params,
      filter_query: {
        ...(params?.filter_query || {}),
        tag_list: {
          in: tag,
        },
      },
    });
  }

  /**
   * Get all stories by tag with automatic pagination
   */
  async getAllStoriesByTag<T extends BlokType = BlokType>(
    tag: string,
    params?: Omit<GetStoriesParams, 'filter_query' | 'page' | 'per_page'>,
    options?: {
      perPage?: number;
      maxPages?: number;
      onProgress?: (page: number, totalFetched: number, total?: number) => void;
    },
  ) {
    return this.getAllStories<T>(
      {
        ...params,
        filter_query: {
          ...(params?.filter_query || {}),
          tag_list: {
            in: tag,
          },
        },
      },
      options,
    );
  }

  /**
   * Get stories that start with a specific path
   */
  async getStoriesByPath<T extends BlokType = BlokType>(
    path: string,
    params?: Omit<GetStoriesParams, 'starts_with'>,
  ) {
    return this.getStories<T>({
      ...params,
      starts_with: path,
    });
  }

  /**
   * Get all stories by path with automatic pagination
   */
  async getAllStoriesByPath<T extends BlokType = BlokType>(
    path: string,
    params?: Omit<GetStoriesParams, 'starts_with' | 'page' | 'per_page'>,
    options?: {
      perPage?: number;
      maxPages?: number;
      onProgress?: (page: number, totalFetched: number, total?: number) => void;
    },
  ) {
    return this.getAllStories<T>(
      {
        ...params,
        starts_with: path,
      },
      options,
    );
  }

  /**
   * Search stories by term
   */
  async searchStories<T extends BlokType = BlokType>(
    searchTerm: string,
    params?: Omit<GetStoriesParams, 'search_term'>,
  ) {
    return this.getStories<T>({
      ...params,
      search_term: searchTerm,
    });
  }

  /**
   * Search all stories by term with automatic pagination
   */
  async searchAllStories<T extends BlokType = BlokType>(
    searchTerm: string,
    params?: Omit<GetStoriesParams, 'search_term' | 'page' | 'per_page'>,
    options?: {
      perPage?: number;
      maxPages?: number;
      onProgress?: (page: number, totalFetched: number, total?: number) => void;
    },
  ) {
    return this.getAllStories<T>(
      {
        ...params,
        search_term: searchTerm,
      },
      options,
    );
  }

  /**
   * Get content delivery API tags
   */
  async getTags(params?: { page?: number; per_page?: number }) {
    return await this.axiosInstance.get<StoryblokTagsResponse>('/tags', {
      params,
    });
  }

  /**
   * Get all tags with automatic pagination handling
   */
  async getAllTags(options?: {
    perPage?: number;
    maxPages?: number;
    onProgress?: (page: number, totalFetched: number, total?: number) => void;
  }) {
    return fetchAllPaginated(
      (page, perPage) => this.getTags({ page, per_page: perPage }),
      (response) => response.tags,
      options,
    );
  }

  /**
   * Get links (for navigation) with comprehensive filtering and pagination support
   *
   * Retrieves links from Storyblok with support for filtering by path, version,
   * parent folder, and pagination. This method returns a single page of results.
   *
   * @param params - Optional parameters for filtering and pagination
   * @param params.starts_with - Filter by full_slug. Can be used to retrieve all links from a specific folder
   * @param params.version - Version to retrieve. Default: 'published'. Possible values: 'draft', 'published'
   * @param params.cv - Used to access a particular cached version by providing a Unix timestamp
   * @param params.with_parent - Filters links by parent_id. Can be set to 0 to return entries not in a folder
   * @param params.include_dates - If set to 1, includes published_at, created_at, updated_at fields
   * @param params.page - Page number for pagination (default: 1)
   * @param params.per_page - Number of items per page (default: 25, max: 1000)
   * @param params.paginated - For spaces created before May 9th, 2023, enables pagination
   *
   * @returns Promise resolving to links response with pagination info
   *
   * @example
   * ```typescript
   * // Get all published links
   * const response = await sdk.getLinks();
   *
   * // Get links from a specific folder
   * const folderLinks = await sdk.getLinks({
   *   starts_with: 'blog/',
   *   version: 'published'
   * });
   *
   * // Get links with dates included
   * const linksWithDates = await sdk.getLinks({
   *   include_dates: 1,
   *   per_page: 50
   * });
   *
   * // Get links from a specific parent folder
   * const childLinks = await sdk.getLinks({
   *   with_parent: 12345
   * });
   * ```
   */
  async getLinks(params?: GetLinksParams) {
    return await this.axiosInstance.get<StoryblokLinksResponse>('/links', {
      params,
    });
  }

  /**
   * Get all links with automatic pagination handling and comprehensive filtering support
   *
   * This will fetch all links across multiple pages using Storyblok's pagination system
   * with support for all filtering options available in the links API.
   *
   * @param params - Optional parameters for filtering links
   * @param params.starts_with - Filter by full_slug. Can be used to retrieve all links from a specific folder
   * @param params.version - Version to retrieve. Default: 'published'. Possible values: 'draft', 'published'
   * @param params.cv - Used to access a particular cached version by providing a Unix timestamp
   * @param params.with_parent - Filters links by parent_id. Can be set to 0 to return entries not in a folder
   * @param params.include_dates - If set to 1, includes published_at, created_at, updated_at fields
   * @param params.paginated - For spaces created before May 9th, 2023, enables pagination
   * @param options - Pagination and progress tracking options
   * @param options.perPage - Number of items per page (default: 25, max: 1000)
   * @param options.maxPages - Maximum number of pages to fetch
   * @param options.onProgress - Callback function called for each page fetched
   *
   * @returns Promise resolving to array of all links
   *
   * @example
   * ```typescript
   * // Get all published links
   * const allLinks = await sdk.getAllLinks();
   *
   * // Get all links from a specific folder
   * const folderLinks = await sdk.getAllLinks({
   *   starts_with: 'blog/',
   *   version: 'published'
   * });
   *
   * // Get all links with dates and progress tracking
   * const linksWithDates = await sdk.getAllLinks({
   *   include_dates: 1,
   *   version: 'published'
   * }, {
   *   perPage: 100,
   *   onProgress: (page, totalFetched) => {
   *     console.log(`Fetched ${totalFetched} links from ${page} pages`);
   *   }
   * });
   * ```
   */
  async getAllLinks(
    params?: Omit<GetLinksParams, 'page' | 'per_page'>,
    options?: {
      perPage?: number;
      maxPages?: number;
      onProgress?: (page: number, totalFetched: number, total?: number) => void;
    },
  ) {
    return fetchAllPaginated(
      (page, perPage) => this.getLinks({ ...params, page, per_page: perPage }),
      (response) => Object.values(response.links), // Convert links object to array
      options,
    );
  }

  /**
   * Get datasource entries
   */
  async getDatasourceEntries(
    datasource: string,
    params?: { page?: number; per_page?: number },
  ) {
    return await this.axiosInstance.get<StoryblokDatasourceEntriesResponse>(
      '/datasource_entries',
      {
        params: { datasource, ...params },
      },
    );
  }

  /**
   * Get all datasource entries with automatic pagination handling
   * Note: Datasource entries support up to 1000 items per page
   */
  async getAllDatasourceEntries(
    datasource: string,
    options?: {
      perPage?: number;
      maxPages?: number;
      onProgress?: (page: number, totalFetched: number, total?: number) => void;
    },
  ) {
    // Datasource entries support up to 1000 per page (higher than stories)
    const adjustedOptions = {
      ...options,
      perPage: Math.min(options?.perPage || 1000, 1000),
    };

    return fetchAllPaginated(
      (page, perPage) =>
        this.getDatasourceEntries(datasource, { page, per_page: perPage }),
      (response) => response.datasource_entries,
      adjustedOptions,
    );
  }
}
