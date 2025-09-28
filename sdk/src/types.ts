import type axios from 'axios';

// Base interfaces for SDK configuration
export interface BaseStoryblokOptions {
  /**
   * Base URL for Storyblok API
   * @default 'https://api.storyblok.com/v2'
   */
  baseURL?: string;
  /**
   * Request timeout in milliseconds
   * @default 10000
   */
  timeout?: number;
  /**
   * Retry configuration for handling rate limits
   */
  retry?: StoryblokRetryOptions;
}

export interface StoryblokSdkOptions extends BaseStoryblokOptions {
  /**
   * Storyblok access token for content delivery
   */
  accessToken: string;
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

// Storyblok API response interfaces
export interface StoryblokStory<T = Record<string, unknown>> {
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
}

export interface StoryblokStoriesResponse<T = Record<string, unknown>> {
  stories: StoryblokStory<T>[];
  cv: number;
  rels: string[];
  links: string[];
}

export interface StoryblokStoryResponse<T = Record<string, unknown>> {
  story: StoryblokStory<T>;
  cv: number;
  rels: string[];
  links: string[];
}

export interface StoryblokComponent {
  id: number;
  name: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
  schema: Record<string, unknown>;
  image: string | null;
  preview_field: string | null;
  is_root: boolean;
  preview_tmpl: string | null;
  is_nestable: boolean;
  all_presets: unknown[];
  preset_id: number | null;
  real_name: string;
  component_group_uuid: string | null;
  color: string | null;
  icon: string | null;
  internal_tags_list: string[];
  internal_tag_ids: number[];
  content_type_asset_preview: string | null;
}

export interface StoryblokSpace {
  id: number;
  name: string;
  domain: string;
  uniq_domain: string | null;
  created_at: string;
  plan: string;
  plan_level: number;
  limits: Record<string, unknown>;
  story_published_hook: string | null;
  environments: Array<{
    id: number;
    name: string;
    location: string;
  }>;
  lang_codes: string[];
  default_lang_name: string;
  plan_name: string;
  trial: boolean;
  suspended: boolean;
  billing_address: Record<string, unknown> | null;
  owner_id: number;
  duplicatable: boolean;
  options: Record<string, unknown>;
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
  in?: string;
  /**
   * Not in array
   */
  not_in_array?: string;
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
  like?: string;
  /**
   * Not like
   */
  not_like?: string;
  /**
   * Regex match
   */
  regex?: string;
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

export interface StoryblokLinksResponse {
  links: Record<string, unknown>;
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

export interface StoryblokStoriesManagementResponse<
  T = Record<string, unknown>,
> {
  stories: StoryblokStory<T>[];
}

export interface StoryblokStoryManagementResponse<T = Record<string, unknown>> {
  story: StoryblokStory<T>;
}

export interface StoryblokComponentResponse {
  component: StoryblokComponent;
}

export interface StoryblokComponentsResponse {
  components: StoryblokComponent[];
}

export interface StoryblokSpaceResponse {
  space: StoryblokSpace;
}

// Simplified story type for getAllStories
export interface StoryblokSimplifiedStory<T = Record<string, unknown>> {
  id: number;
  name: string;
  slug: string;
  full_slug: string;
  content: T;
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
