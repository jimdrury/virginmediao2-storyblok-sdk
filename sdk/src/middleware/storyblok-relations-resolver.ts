import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import type { StoryblokStory } from '../types';
import type { StoryblokApiResponseWithStoryRels } from './shared-types';

export interface StoryblokRelationsResolverConfig {
  resolveRelations: `${string}.${string}`[];
  removeUnresolvedRelations?: boolean;
}

export const storyblokRelationsResolver =
  (options: StoryblokRelationsResolverConfig) =>
  (axiosInstance: AxiosInstance): void => {
    if (!options.resolveRelations || options.resolveRelations.length === 0) {
      return;
    }

    axiosInstance.interceptors.request.use(
      (requestConfig: InternalAxiosRequestConfig) => {
        if (requestConfig.params?.resolve_relations) {
          return requestConfig;
        }

        if (!isStoryblokCdnRequest(requestConfig)) {
          return requestConfig;
        }

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

    axiosInstance.interceptors.response.use(
      (response: AxiosResponse<StoryblokApiResponseWithStoryRels>) => {
        if (!isStoryblokCdnResponse(response)) {
          return response;
        }

        const data = response.data;
        const rels = data.rels || [];

        const relsMap = new Map<string, StoryblokStory>();
        rels.forEach((rel) => {
          relsMap.set(rel.uuid, rel);
        });

        if ('story' in data && data.story) {
          data.story = resolveStoryRelations(
            data.story,
            relsMap,
            options.resolveRelations,
            options.removeUnresolvedRelations,
          );
        }

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

function isStoryblokCdnRequest(config: InternalAxiosRequestConfig): boolean {
  const url = config.url || '';
  return url.includes('/stories') || url.includes('/story');
}

function isStoryblokCdnResponse(response: AxiosResponse): boolean {
  const config = response.config;
  const result = isStoryblokCdnRequest(config);
  return result;
}

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

  if (resolved.component && typeof resolved.component === 'string') {
    const componentName = resolved.component;

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

function resolveFieldRelations(
  field: string | string[] | unknown,
  relsMap: Map<string, StoryblokStory>,
  removeUnresolvedRelations = false,
): StoryblokStory | string | (StoryblokStory | string)[] | undefined {
  if (typeof field === 'string') {
    const resolvedStory = relsMap.get(field);
    if (resolvedStory) {
      return resolvedStory;
    }

    return removeUnresolvedRelations ? undefined : field;
  }

  if (Array.isArray(field)) {
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
