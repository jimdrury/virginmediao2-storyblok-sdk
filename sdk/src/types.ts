import type axios from 'axios';
import type { AxiosInstance } from 'axios';

type AxiosMiddleware = (axiosInstance: AxiosInstance) => void;

// Base interfaces for SDK configuration
export interface BaseStoryblokOptions {
  /**
   * Base URL for Storyblok API
   * @default 'https://api.storyblok.com/v2'
   */
  baseURL?: `https://${string}`;
  /**
   * Request timeout in milliseconds
   * @default 10000
   */
  timeout?: number;
  /**
   * Retry configuration for handling rate limits
   */
  retry?: StoryblokRetryOptions;

  /**
   * Axios middleware to apply to the axios instance
   */
  middlewares?: Array<AxiosMiddleware>;
}

export interface StoryblokManagerSdkOptions extends BaseStoryblokOptions {
  /**
   * Personal access token for management API
   */
  personalAccessToken?: string;
  /**
   * OAuth token for management API
   */
  oauthToken?: string;
}

export interface BlokType<T = string> {
  _uid: string;
  _editable?: string;
  component: T;
  [key: string]: unknown;
}

// Storyblok API response interfaces
export interface StoryType<T extends BlokType = BlokType> {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  full_slug: string;
  content: T;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  first_published_at: string | null;
  sort_by_date: string | null;
  tag_list: string[];
  is_startpage: boolean;
  parent_id: number | null;
  meta_data: Record<string, unknown> | null;
  group_id: string;
  alternates: Array<{
    id: number;
    name: string;
    slug: string;
    published: boolean;
    full_slug: string;
    is_folder: boolean;
    parent_id: number | null;
  }>;
  translated_slugs: Array<{
    path: string;
    name: string | null;
    lang: string;
  }>;
  default_full_slug?: string;
}

export interface StoryblokStoriesResponse<T extends BlokType> {
  stories: StoryType<T>[];
  cv: number;
  rels: string[];
  links: string[];
}

export interface StoryblokStoryResponse<T extends BlokType> {
  story: StoryType<T>;
  cv: number;
  rels: string[];
  links: string[];
}

// Filter query types for Storyblok API
export interface StoryblokFilterOperators {
  /**
   * Exact match
   */
  is?: string | number | boolean;
  /**
   * Not equal
   */
  not_in?: string | number | boolean;
  /**
   * In array
   */
  in?: string | number | boolean;
  /**
   * Not in array
   */
  not_in_array?: string | number | boolean;
  /**
   * Contains (for arrays and strings)
   */
  in_array?: string;
  /**
   * All in array
   */
  all_in_array?: string;
  /**
   * Greater than
   */
  gt?: string | number;
  /**
   * Greater than or equal
   */
  gte?: string | number;
  /**
   * Less than
   */
  lt?: string | number;
  /**
   * Less than or equal
   */
  lte?: string | number;
  /**
   * Like (partial match)
   */
  like?: string | number;
  /**
   * Not like
   */
  not_like?: string | number;
  /**
   * Regex match
   */
  regex?: string | number;
}

export type StoryblokFilterQuery = Record<
  string,
  StoryblokFilterOperators | string | number | boolean
>;

// Request parameter interfaces
export interface GetStoriesParams {
  /**
   * Filter by starts_with parameter
   */
  starts_with?: string;
  /**
   * Include draft content
   */
  is_startpage?: boolean;
  /**
   * Filter by specific content type and field values
   */
  filter_query?: StoryblokFilterQuery;
  /**
   * Sort parameter
   */
  sort_by?: string;
  /**
   * Search term
   */
  search_term?: string;
  /**
   * Page number for pagination
   */
  page?: number;
  /**
   * Number of items per page
   */
  per_page?: number;
  /**
   * Cache version
   */
  cv?: number;
  /**
   * Resolve relations
   */
  resolve_relations?: `${string}:${string}`[];
  /**
   * Resolve links
   */
  resolve_links?: 'url' | 'story';
  /**
   * Language code
   */
  language?: string;
  /**
   * Fallback language
   */
  fallback_lang?: string;
  /**
   * Include draft versions
   */
  version?: 'draft' | 'published';
  /**
   * Additional query parameters
   */
  [key: string]: unknown;
}

export interface GetStoryParams {
  /**
   * Cache version
   */
  cv?: number;
  /**
   * Resolve relations
   */
  resolve_relations?: string | string[];
  /**
   * Resolve links
   */
  resolve_links?: string;
  /**
   * Language code
   */
  language?: string;
  /**
   * Fallback language
   */
  fallback_lang?: string;
  /**
   * Include draft versions
   */
  version?: 'draft' | 'published';
  /**
   * Find by UUID instead of slug
   */
  find_by?: 'uuid';
  /**
   * Additional query parameters
   */
  [key: string]: unknown;
}

// API response types
export interface StoryblokTag {
  name: string;
  taggings_count: number;
}

export interface StoryblokTagsResponse {
  tags: StoryblokTag[];
}

// Link object structure based on Storyblok API documentation
export interface StoryblokLink {
  id: number;
  uuid: string;
  slug: string;
  path: string | null;
  real_path: string;
  name: string;
  published: boolean;
  parent_id: number | null;
  is_folder: boolean;
  is_startpage: boolean;
  position: number;
  published_at?: string; // Only included if include_dates=1
  created_at?: string; // Only included if include_dates=1
  updated_at?: string; // Only included if include_dates=1
  alternates?: Array<{
    path: string;
    name: string;
    lang: string;
    published: boolean;
    translated_slug: string;
  }>;
}

export interface StoryblokLinksResponse {
  links: Record<string, StoryblokLink>;
}

// Parameters for getLinks function based on Storyblok API documentation
export interface GetLinksParams {
  /**
   * Filter by full_slug. Can be used to retrieve all links from a specific folder.
   * Examples: starts_with=de/beitraege, starts_with=en/posts
   */
  starts_with?: string;
  /**
   * Version to retrieve. Default: 'published'. Possible values: 'draft', 'published'
   */
  version?: 'draft' | 'published';
  /**
   * Used to access a particular cached version of a published story by providing a Unix timestamp.
   * Further information is found under Cache Invalidation.
   */
  cv?: number;
  /**
   * Filters links by parent_id. Can be set to 0 to return entries not located in a folder.
   * In contrast, specifying a folder's id returns only entries located in this particular folder.
   */
  with_parent?: number;
  /**
   * Default: 0. If set to 1, the following fields are included in the response:
   * published_at, created_at, updated_at.
   */
  include_dates?: 0 | 1;
  /**
   * Page number for pagination. Default: 1
   */
  page?: number;
  /**
   * Number of items per page. Default: 25. Max: 1000
   */
  per_page?: number;
  /**
   * For spaces created before May 9th, 2023, the links endpoint is not paginated by default.
   * Setting this parameter to 1 enables pagination. This parameter does not impact spaces
   * created after May 9th, 2023, i.e., pagination cannot be disabled for these spaces.
   */
  paginated?: 0 | 1;
}

export interface StoryblokDatasourceEntry {
  name: string;
  value: string;
  dimension_value?: string;
}

export interface StoryblokDatasourceEntriesResponse {
  datasource_entries: StoryblokDatasourceEntry[];
}

export interface StoryblokAsset {
  id: number;
  filename: string;
  public_url: string;
  [key: string]: unknown;
}

export interface StoryblokAssetsResponse {
  assets: StoryblokAsset[];
}

// Rate limiting and retry options
export interface StoryblokRetryOptions {
  /**
   * Base delay in milliseconds for exponential backoff
   * @default 50
   */
  baseDelay?: number;
  /**
   * Maximum delay in milliseconds
   * @default 2000
   */
  maxDelay?: number;
}

// Middleware types for axios interceptors - using inferred types from axios instance
export type StoryblokAxiosInterceptors = ReturnType<
  typeof axios.create
>['interceptors'];
