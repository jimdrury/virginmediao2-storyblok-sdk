import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import type {
  StoryblokStoriesResponse,
  StoryblokStory,
  StoryblokStoryResponse,
} from '../types';

export interface StoryblokRelationsResolverConfig {
  resolveRelations: `${string}.${string}`[];
  removeUnresolvedRelations?: boolean;
}

interface StoryblokApiResponseWithRels
  extends Omit<StoryblokStoriesResponse, 'rels'> {
  rels: StoryblokStory[];
}

interface StoryblokStoryResponseWithRels
  extends Omit<StoryblokStoryResponse, 'rels'> {
  rels: StoryblokStory[];
}

type StoryblokApiResponseWithStoryRels =
  | StoryblokApiResponseWithRels
  | StoryblokStoryResponseWithRels;

export const storyblokRelationsResolver =
  (options: StoryblokRelationsResolverConfig) =>
  (axiosInstance: AxiosInstance): void => {
    if (!options.resolveRelations || options.resolveRelations.length === 0) {
      return;
    }

    // Request interceptor - add resolve_relations parameter
    axiosInstance.interceptors.request.use(
      (requestConfig: InternalAxiosRequestConfig) => {
        if (requestConfig.params?.resolve_relations) {
          return requestConfig;
        }

        // Only apply to Storyblok CDN API endpoints
        if (!isStoryblokCdnRequest(requestConfig)) {
          return requestConfig;
        }

        // Initialize params if not present
        if (!requestConfig.params) {
          requestConfig.params = {};
        }

        const resolve_relations = options.resolveRelations.join(',');

        requestConfig.params = {
          ...requestConfig.params,
          resolve_relations,
        };

        return requestConfig;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor - resolve relations in the response data
    axiosInstance.interceptors.response.use(
      (response: AxiosResponse<StoryblokApiResponseWithStoryRels>) => {
        // Only process Storyblok CDN API responses
        if (!isStoryblokCdnResponse(response)) {
          return response;
        }

        const data = response.data;
        const rels = data.rels || [];

        // Create a map of UUID to story object for quick lookup
        const relsMap = new Map<string, StoryblokStory>();
        rels.forEach((rel) => {
          relsMap.set(rel.uuid, rel);
        });

        // Process single story
        if ('story' in data && data.story) {
          data.story = resolveStoryRelations(
            data.story,
            relsMap,
            options.resolveRelations,
            options.removeUnresolvedRelations,
          );
        }

        // Process array of stories
        if ('stories' in data && data.stories) {
          data.stories = data.stories.map((story) =>
            resolveStoryRelations(
              story,
              relsMap,
              options.resolveRelations,
              options.removeUnresolvedRelations,
            ),
          );
        }

        return response;
      },
      (error) => Promise.reject(error),
    );
  };

/**
 * Checks if the request is targeting a Storyblok CDN API endpoint
 */
function isStoryblokCdnRequest(config: InternalAxiosRequestConfig): boolean {
  const url = config.url || '';
  return url.includes('/stories') || url.includes('/story');
}

/**
 * Checks if the response is from a Storyblok CDN API endpoint
 */
function isStoryblokCdnResponse(response: AxiosResponse): boolean {
  const config = response.config;
  const result = isStoryblokCdnRequest(config);
  return result;
}

/**
 * Recursively resolves relations in a story object
 */
function resolveStoryRelations(
  story: StoryblokStory,
  relsMap: Map<string, StoryblokStory>,
  resolveRelations: `${string}.${string}`[],
  removeUnresolvedRelations = false,
): StoryblokStory {
  if (!story.content) {
    return story;
  }

  const resolvedStory = { ...story };
  resolvedStory.content = resolveObjectRelations(
    story.content,
    relsMap,
    resolveRelations,
    removeUnresolvedRelations,
  ) as Record<string, unknown>;

  return resolvedStory;
}

/**
 * Recursively resolves relations in any object
 */
function resolveObjectRelations(
  obj: unknown,
  relsMap: Map<string, StoryblokStory>,
  resolveRelations: `${string}.${string}`[],
  removeUnresolvedRelations = false,
): unknown {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) =>
      resolveObjectRelations(
        item,
        relsMap,
        resolveRelations,
        removeUnresolvedRelations,
      ),
    );
  }

  const resolved = { ...obj } as Record<string, unknown>;

  // Check if this object has a component field
  if (resolved.component && typeof resolved.component === 'string') {
    const componentName = resolved.component;

    // Find matching resolve relations for this component
    const matchingRelations = resolveRelations.filter((relation) =>
      relation.startsWith(`${componentName}.`),
    );

    matchingRelations.forEach((relation) => {
      const fieldName = relation.split('.')[1];

      if (resolved[fieldName] !== undefined) {
        const resolvedField = resolveFieldRelations(
          resolved[fieldName],
          relsMap,
          removeUnresolvedRelations,
        );
        resolved[fieldName] = resolvedField;
      }
    });
  }

  // Recursively process all other fields
  Object.keys(resolved).forEach((key) => {
    if (key !== 'component') {
      resolved[key] = resolveObjectRelations(
        resolved[key],
        relsMap,
        resolveRelations,
        removeUnresolvedRelations,
      );
    }
  });

  return resolved;
}

/**
 * Resolves relations in a field (string or array of strings)
 */
function resolveFieldRelations(
  field: string | string[] | unknown,
  relsMap: Map<string, StoryblokStory>,
  removeUnresolvedRelations = false,
): StoryblokStory | string | (StoryblokStory | string)[] | undefined {
  if (typeof field === 'string') {
    // Single UUID string
    const resolvedStory = relsMap.get(field);
    if (resolvedStory) {
      return resolvedStory;
    }

    return removeUnresolvedRelations ? undefined : field;
  }

  if (Array.isArray(field)) {
    // Array of UUID strings
    const resolved: (StoryblokStory | string | undefined)[] = field.map(
      (uuid) => {
        if (typeof uuid === 'string') {
          const resolvedStory = relsMap.get(uuid);
          if (resolvedStory) {
            return resolvedStory;
          }

          return removeUnresolvedRelations ? undefined : uuid;
        }

        return uuid;
      },
    );

    // Filter out undefined values if removeUnresolvedRelations is true
    return removeUnresolvedRelations
      ? (resolved.filter((item) => item !== undefined) as (
          | StoryblokStory
          | string
        )[])
      : (resolved as (StoryblokStory | string)[]);
  }

  return field as
    | StoryblokStory
    | string
    | (StoryblokStory | string)[]
    | undefined;
}
