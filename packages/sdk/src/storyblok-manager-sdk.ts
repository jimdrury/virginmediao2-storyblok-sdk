import axios, { type AxiosInstance } from 'axios';
import { addRetryInterceptor } from './interceptors';
import type {
  StoryblokAsset,
  StoryblokAssetsResponse,
  StoryblokComponentResponse,
  StoryblokComponentsResponse,
  StoryblokManagerSdkOptions,
  StoryblokSpaceResponse,
  StoryblokStoriesManagementResponse,
  StoryblokStoryManagementResponse,
} from './types';

/**
 * Storyblok Management SDK for content management API
 * Provides access to management operations like creating, updating, and deleting content
 */
export class StoryblokManagerSdk {
  private axiosInstance: AxiosInstance;
  private authToken: string;
  private baseURL: string;
  private authType: 'personal' | 'oauth';

  constructor(options: StoryblokManagerSdkOptions) {
    if (!options.personalAccessToken && !options.oauthToken) {
      throw new Error(
        'Either personalAccessToken or oauthToken must be provided',
      );
    }

    this.authToken = options.personalAccessToken || options.oauthToken || '';
    this.authType = options.personalAccessToken ? 'personal' : 'oauth';
    this.baseURL = options.baseURL || 'https://mapi.storyblok.com/v1';

    // Create axios instance with default configuration
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: options.timeout || 10000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization:
          this.authType === 'personal'
            ? this.authToken
            : `Bearer ${this.authToken}`,
      },
    });

    // Add retry interceptor (always enabled)
    addRetryInterceptor(this.axiosInstance, options.retry);
  }

  /**
   * Get axios interceptors for adding custom middleware
   */
  get interceptors() {
    return this.axiosInstance.interceptors;
  }

  // Space Management
  /**
   * Get current space information
   */
  async getSpace() {
    return await this.axiosInstance.get<StoryblokSpaceResponse>('/spaces/me');
  }

  // Story Management
  /**
   * Get stories from management API (includes drafts)
   */
  async getStories<T = Record<string, unknown>>(
    spaceId: number,
    params?: {
      page?: number;
      per_page?: number;
      sort_by?: string;
      search?: string;
      filter_query?: Record<string, unknown>;
      is_startpage?: boolean;
      in_trash?: boolean;
    },
  ) {
    return await this.axiosInstance.get<StoryblokStoriesManagementResponse<T>>(
      `/spaces/${spaceId}/stories`,
      {
        params,
      },
    );
  }

  /**
   * Get a single story by ID
   */
  async getStory<T = Record<string, unknown>>(
    spaceId: number,
    storyId: number,
  ) {
    return await this.axiosInstance.get<StoryblokStoryManagementResponse<T>>(
      `/spaces/${spaceId}/stories/${storyId}`,
    );
  }

  /**
   * Create a new story
   */
  async createStory<T = Record<string, unknown>>(
    spaceId: number,
    storyData: {
      name: string;
      slug: string;
      content?: T;
      parent_id?: number;
      is_folder?: boolean;
      is_startpage?: boolean;
      [key: string]: unknown;
    },
  ) {
    return await this.axiosInstance.post<StoryblokStoryManagementResponse<T>>(
      `/spaces/${spaceId}/stories`,
      {
        story: storyData,
      },
    );
  }

  /**
   * Update an existing story
   */
  async updateStory<T = Record<string, unknown>>(
    spaceId: number,
    storyId: number,
    storyData: Partial<{
      name: string;
      slug: string;
      content: T;
      parent_id: number;
      is_folder: boolean;
      is_startpage: boolean;
      [key: string]: unknown;
    }>,
  ) {
    return await this.axiosInstance.put<StoryblokStoryManagementResponse<T>>(
      `/spaces/${spaceId}/stories/${storyId}`,
      {
        story: storyData,
      },
    );
  }

  /**
   * Delete a story
   */
  async deleteStory(spaceId: number, storyId: number) {
    return await this.axiosInstance.delete<StoryblokStoryManagementResponse>(
      `/spaces/${spaceId}/stories/${storyId}`,
    );
  }

  /**
   * Publish a story
   */
  async publishStory<T = Record<string, unknown>>(
    spaceId: number,
    storyId: number,
  ) {
    return await this.axiosInstance.get<StoryblokStoryManagementResponse<T>>(
      `/spaces/${spaceId}/stories/${storyId}/publish`,
    );
  }

  /**
   * Unpublish a story
   */
  async unpublishStory<T = Record<string, unknown>>(
    spaceId: number,
    storyId: number,
  ) {
    return await this.axiosInstance.get<StoryblokStoryManagementResponse<T>>(
      `/spaces/${spaceId}/stories/${storyId}/unpublish`,
    );
  }

  // Component Management
  /**
   * Get components
   */
  async getComponents(spaceId: number) {
    return await this.axiosInstance.get<StoryblokComponentsResponse>(
      `/spaces/${spaceId}/components`,
    );
  }

  /**
   * Get a single component
   */
  async getComponent(spaceId: number, componentId: number) {
    return await this.axiosInstance.get<StoryblokComponentResponse>(
      `/spaces/${spaceId}/components/${componentId}`,
    );
  }

  /**
   * Create a new component
   */
  async createComponent(
    spaceId: number,
    componentData: {
      name: string;
      display_name?: string;
      schema?: Record<string, unknown>;
      image?: string;
      preview_field?: string;
      is_root?: boolean;
      is_nestable?: boolean;
      [key: string]: unknown;
    },
  ) {
    return await this.axiosInstance.post<StoryblokComponentResponse>(
      `/spaces/${spaceId}/components`,
      {
        component: componentData,
      },
    );
  }

  /**
   * Update a component
   */
  async updateComponent(
    spaceId: number,
    componentId: number,
    componentData: Partial<{
      name: string;
      display_name: string;
      schema: Record<string, unknown>;
      image: string;
      preview_field: string;
      is_root: boolean;
      is_nestable: boolean;
      [key: string]: unknown;
    }>,
  ) {
    return await this.axiosInstance.put<StoryblokComponentResponse>(
      `/spaces/${spaceId}/components/${componentId}`,
      {
        component: componentData,
      },
    );
  }

  /**
   * Delete a component
   */
  async deleteComponent(spaceId: number, componentId: number) {
    return await this.axiosInstance.delete<StoryblokComponentResponse>(
      `/spaces/${spaceId}/components/${componentId}`,
    );
  }

  // Asset Management
  /**
   * Upload an asset
   */
  async uploadAsset(
    spaceId: number,
    file: File | Blob | Buffer,
    filename: string,
    options?: {
      alt?: string;
      title?: string;
      copyright?: string;
      source?: string;
    },
  ) {
    const formData = new FormData();
    formData.append('file', file as Blob, filename);

    if (options?.alt) formData.append('alt', options.alt);
    if (options?.title) formData.append('title', options.title);
    if (options?.copyright) formData.append('copyright', options.copyright);
    if (options?.source) formData.append('source', options.source);

    return await this.axiosInstance.post<StoryblokAsset>(
      `/spaces/${spaceId}/assets`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  }

  /**
   * Get assets
   */
  async getAssets(
    spaceId: number,
    params?: {
      page?: number;
      per_page?: number;
      search?: string;
    },
  ) {
    return await this.axiosInstance.get<StoryblokAssetsResponse>(
      `/spaces/${spaceId}/assets`,
      {
        params,
      },
    );
  }

  /**
   * Delete an asset
   */
  async deleteAsset(spaceId: number, assetId: number) {
    return await this.axiosInstance.delete<StoryblokAsset>(
      `/spaces/${spaceId}/assets/${assetId}`,
    );
  }
}
