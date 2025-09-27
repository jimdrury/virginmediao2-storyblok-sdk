import axios, { type AxiosInstance } from "axios";
import { addAccessTokenInterceptor, addRetryInterceptor } from "./interceptors";
import type {
  GetStoriesParams,
  GetStoryParams,
  StoryblokDatasourceEntriesResponse,
  StoryblokLinksResponse,
  StoryblokSdkOptions,
  StoryblokStoriesResponse,
  StoryblokStoryResponse,
  StoryblokTagsResponse,
} from "./types";
import { fetchAllPaginated } from "./utils";

/**
 * Storyblok SDK for content delivery API
 * Provides access to published and draft content
 */
export class StoryblokSdk {
  private axiosInstance: AxiosInstance;
  private accessToken: string;
  private baseURL: string;

  constructor(options: StoryblokSdkOptions) {
    this.accessToken = options.accessToken;
    this.baseURL = options.baseURL || "https://api.storyblok.com/v2";

    // Create axios instance with default configuration
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: options.timeout || 10000,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    addAccessTokenInterceptor(this.axiosInstance, this.accessToken);
    addRetryInterceptor(this.axiosInstance, options.retry);
  }

  /**
   * Get axios interceptors for adding custom middleware
   */
  get interceptors() {
    return this.axiosInstance.interceptors;
  }

  /**
   * Get multiple stories with optional filtering and pagination
   */
  async getStories<T = Record<string, unknown>>(params?: GetStoriesParams) {
    return await this.axiosInstance.get<StoryblokStoriesResponse<T>>("/stories", {
      params,
    });
  }

  /**
   * Get all stories with automatic pagination handling
   * This will fetch all stories across multiple pages using Storyblok's pagination system
   *
   * @see https://www.storyblok.com/docs/api/content-delivery/v2/getting-started/pagination
   */
  async getAllStories<T = Record<string, unknown>>(
    params?: Omit<GetStoriesParams, "page" | "per_page">,
    options?: {
      perPage?: number;
      maxPages?: number;
      onProgress?: (page: number, totalFetched: number, total?: number) => void;
    }
  ) {
    return fetchAllPaginated(
      (page, perPage) => this.getStories<T>({ ...params, page, per_page: perPage }),
      (response) =>
        response.stories.map((story) => ({
          id: story.id,
          name: story.name,
          slug: story.slug,
          full_slug: story.full_slug,
          content: story.content,
        })),
      options
    );
  }

  /**
   * Get a single story by slug or UUID
   */
  async getStory<T = Record<string, unknown>>(slug: string, params?: GetStoryParams) {
    return await this.axiosInstance.get<StoryblokStoryResponse<T>>(`/stories/${slug}`, {
      params,
    });
  }

  /**
   * Get stories by tag
   */
  async getStoriesByTag<T = Record<string, unknown>>(
    tag: string,
    params?: Omit<GetStoriesParams, "filter_query">
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
  async getAllStoriesByTag<T = Record<string, unknown>>(
    tag: string,
    params?: Omit<GetStoriesParams, "filter_query" | "page" | "per_page">,
    options?: {
      perPage?: number;
      maxPages?: number;
      onProgress?: (page: number, totalFetched: number, total?: number) => void;
    }
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
      options
    );
  }

  /**
   * Get stories that start with a specific path
   */
  async getStoriesByPath<T = Record<string, unknown>>(
    path: string,
    params?: Omit<GetStoriesParams, "starts_with">
  ) {
    return this.getStories<T>({
      ...params,
      starts_with: path,
    });
  }

  /**
   * Get all stories by path with automatic pagination
   */
  async getAllStoriesByPath<T = Record<string, unknown>>(
    path: string,
    params?: Omit<GetStoriesParams, "starts_with" | "page" | "per_page">,
    options?: {
      perPage?: number;
      maxPages?: number;
      onProgress?: (page: number, totalFetched: number, total?: number) => void;
    }
  ) {
    return this.getAllStories<T>(
      {
        ...params,
        starts_with: path,
      },
      options
    );
  }

  /**
   * Search stories by term
   */
  async searchStories<T = Record<string, unknown>>(
    searchTerm: string,
    params?: Omit<GetStoriesParams, "search_term">
  ) {
    return this.getStories<T>({
      ...params,
      search_term: searchTerm,
    });
  }

  /**
   * Search all stories by term with automatic pagination
   */
  async searchAllStories<T = Record<string, unknown>>(
    searchTerm: string,
    params?: Omit<GetStoriesParams, "search_term" | "page" | "per_page">,
    options?: {
      perPage?: number;
      maxPages?: number;
      onProgress?: (page: number, totalFetched: number, total?: number) => void;
    }
  ) {
    return this.getAllStories<T>(
      {
        ...params,
        search_term: searchTerm,
      },
      options
    );
  }

  /**
   * Get content delivery API tags
   */
  async getTags(params?: { page?: number; per_page?: number }) {
    return await this.axiosInstance.get<StoryblokTagsResponse>("/tags", { params });
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
      options
    );
  }

  /**
   * Get links (for navigation)
   */
  async getLinks(params?: { page?: number; per_page?: number }) {
    return await this.axiosInstance.get<StoryblokLinksResponse>("/links", { params });
  }

  /**
   * Get all links with automatic pagination handling
   */
  async getAllLinks(options?: {
    perPage?: number;
    maxPages?: number;
    onProgress?: (page: number, totalFetched: number, total?: number) => void;
  }) {
    return fetchAllPaginated(
      (page, perPage) => this.getLinks({ page, per_page: perPage }),
      (response) => Object.values(response.links), // Convert links object to array
      options
    );
  }

  /**
   * Get datasource entries
   */
  async getDatasourceEntries(datasource: string, params?: { page?: number; per_page?: number }) {
    return await this.axiosInstance.get<StoryblokDatasourceEntriesResponse>("/datasource_entries", {
      params: { datasource, ...params },
    });
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
    }
  ) {
    // Datasource entries support up to 1000 per page (higher than stories)
    const adjustedOptions = {
      ...options,
      perPage: Math.min(options?.perPage || 1000, 1000),
    };

    return fetchAllPaginated(
      (page, perPage) => this.getDatasourceEntries(datasource, { page, per_page: perPage }),
      (response) => response.datasource_entries,
      adjustedOptions
    );
  }
}
