import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import type { StoryblokComponent, StoryblokStory } from '../types';
import type {
  StoryblokApiResponseWithStoryLinks,
  StoryblokApiResponseWithStoryRels,
} from './shared-types';
import {
  addParamIfNotPresent,
  isStoryblokCdnRequest,
  isStoryblokCdnResponse,
  standardErrorHandler,
} from './shared-utils';

export interface StoryblokResolverConfigOptions {
  /**
   * Array of relation patterns to resolve (e.g., ['blog_post.author', 'page.featured_story'])
   * Optional - if not provided, relations won't be resolved
   */
  resolveRelations?: `${string}.${string}`[];
  /**
   * Whether to remove unresolved relations from the response
   * @default false
   */
  removeUnresolvedRelations?: boolean;
  /**
   * Type of link resolution to apply
   * - 'link': Resolve links as link objects
   * - 'url': Resolve links as URLs
   * - 'story': Resolve links as full story objects
   * Optional - if not provided, links won't be resolved
   */
  resolveLinks?: 'link' | 'url' | 'story';
}

/**
 * Factory function that creates a unified Storyblok resolver middleware
 *
 * This middleware combines both relations and links resolution functionality:
 * - Resolves Storyblok relations by converting UUID references to full story objects
 * - Resolves Storyblok links based on the specified resolution type
 * - Both features are optional and can be used independently or together
 *
 * @param config - Configuration for the resolver middleware
 * @param config.resolveRelations - Optional array of relation patterns to resolve
 * @param config.removeUnresolvedRelations - Whether to remove unresolved relations
 * @param config.resolveLinks - Optional type of link resolution
 * @returns A middleware function that can be applied to an AxiosInstance
 *
 * @example
 * ```typescript
 * import { storyblokResolverConfig } from "@virginmediao2/storyblok-sdk";
 *
 * // Relations only
 * const relationsMiddleware = storyblokResolverConfig({
 *   resolveRelations: ['blog_post.author', 'page.featured_story'],
 *   removeUnresolvedRelations: false
 * });
 *
 * // Links only
 * const linksMiddleware = storyblokResolverConfig({
 *   resolveLinks: 'story'
 * });
 *
 * // Both relations and links
 * const fullResolverMiddleware = storyblokResolverConfig({
 *   resolveRelations: ['blog_post.author'],
 *   resolveLinks: 'story',
 *   removeUnresolvedRelations: true
 * });
 *
 * // Apply to axios instance
 * fullResolverMiddleware(axiosInstance);
 * ```
 */
export const storyblokResolverConfig =
  (config: StoryblokResolverConfigOptions) =>
  (axiosInstance: AxiosInstance): void => {
    const hasRelationsConfig =
      config.resolveRelations && config.resolveRelations.length > 0;
    const hasLinksConfig = config.resolveLinks;

    // Only add interceptors if at least one resolution type is configured
    if (!hasRelationsConfig && !hasLinksConfig) {
      return;
    }

    // Add request interceptor to set resolve parameters
    axiosInstance.interceptors.request.use(
      (requestConfig: InternalAxiosRequestConfig) => {
        if (!isStoryblokCdnRequest(requestConfig)) {
          return requestConfig;
        }

        // Add resolve_relations parameter if configured and not already present
        if (hasRelationsConfig) {
          addParamIfNotPresent(
            requestConfig,
            'resolve_relations',
            config.resolveRelations?.join(','),
          );
        }

        // Add resolve_links parameter if configured and not already present
        if (hasLinksConfig) {
          addParamIfNotPresent(
            requestConfig,
            'resolve_links',
            config.resolveLinks,
          );
        }

        return requestConfig;
      },
      standardErrorHandler,
    );

    // Add response interceptor to process resolved data
    axiosInstance.interceptors.response.use(
      (
        response: AxiosResponse<
          StoryblokApiResponseWithStoryRels & StoryblokApiResponseWithStoryLinks
        >,
      ) => {
        if (!isStoryblokCdnResponse(response)) {
          return response;
        }

        const data = response.data;

        // Handle malformed response data
        if (!data || typeof data !== 'object') {
          return response;
        }

        // Process relations if configured
        if (hasRelationsConfig) {
          const rels = (data.rels ||
            []) as StoryblokStory<StoryblokComponent>[];
          const relsMap = new Map<string, StoryblokStory<StoryblokComponent>>();
          rels.forEach((rel) => {
            relsMap.set(rel.uuid, rel);
          });

          if ('story' in data && data.story) {
            data.story = resolveStoryRelations(
              data.story,
              relsMap,
              config.resolveRelations, // We know this exists because hasRelationsConfig is true
              config.removeUnresolvedRelations,
            );
          }

          if ('stories' in data && data.stories) {
            data.stories = data.stories.map(
              (story: StoryblokStory<StoryblokComponent>) =>
                resolveStoryRelations(
                  story,
                  relsMap,
                  config.resolveRelations, // We know this exists because hasRelationsConfig is true
                  config.removeUnresolvedRelations,
                ),
            );
          }
        }

        // Process links if configured
        if (hasLinksConfig) {
          const links = data.links || [];
          const linksMap = new Map<
            string,
            StoryblokStory<StoryblokComponent>
          >();

          // Handle both array format (from stories API) and object format (from links API)
          if (Array.isArray(links)) {
            (links as StoryblokStory<StoryblokComponent>[]).forEach((link) => {
              linksMap.set(link.uuid, link);
            });
          } else if (typeof links === 'object' && links !== null) {
            // For links API, data.links is Record<string, StoryblokLink>
            // Convert to array of stories for processing
            Object.values(links).forEach((link: unknown) => {
              if (
                link &&
                typeof link === 'object' &&
                'uuid' in link &&
                typeof link.uuid === 'string'
              ) {
                linksMap.set(
                  link.uuid,
                  link as StoryblokStory<StoryblokComponent>,
                );
              }
            });
          }

          if ('story' in data && data.story) {
            data.story = resolveStoryLinks(data.story, linksMap);
          }

          if ('stories' in data && data.stories) {
            data.stories = data.stories.map(
              (story: StoryblokStory<StoryblokComponent>) =>
                resolveStoryLinks(story, linksMap),
            );
          }
        }

        return response;
      },
      standardErrorHandler,
    );
  };

/**
 * Resolves relations in a story object
 */
function resolveStoryRelations(
  story: StoryblokStory<StoryblokComponent>,
  relsMap: Map<string, StoryblokStory<StoryblokComponent>>,
  resolveRelations: `${string}.${string}`[] | undefined,
  removeUnresolvedRelations = false,
): StoryblokStory<StoryblokComponent> {
  if (!story.content || !resolveRelations) {
    return story;
  }

  const resolvedStory = { ...story };
  resolvedStory.content = resolveObjectRelations(
    story.content as unknown as Record<string, unknown>,
    relsMap,
    resolveRelations,
    removeUnresolvedRelations,
  ) as unknown as StoryblokComponent;

  return resolvedStory;
}

/**
 * Resolves relations in an object recursively
 */
function resolveObjectRelations(
  obj: unknown,
  relsMap: Map<string, StoryblokStory<StoryblokComponent>>,
  resolveRelations: `${string}.${string}`[] | undefined,
  removeUnresolvedRelations = false,
): unknown {
  if (!obj || typeof obj !== 'object' || !resolveRelations) {
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

  // Recursively process nested objects
  Object.keys(resolved).forEach((key) => {
    if (resolved[key] && typeof resolved[key] === 'object') {
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
 * Resolves relations in a specific field
 */
function resolveFieldRelations(
  field: unknown,
  relsMap: Map<string, StoryblokStory<StoryblokComponent>>,
  removeUnresolvedRelations = false,
): unknown {
  if (typeof field === 'string') {
    // Single UUID reference
    const resolvedStory = relsMap.get(field);
    if (resolvedStory) {
      return resolvedStory;
    }
    return removeUnresolvedRelations ? null : field;
  }

  if (Array.isArray(field)) {
    // Array of UUID references
    const resolved = field
      .map((uuid) => {
        if (typeof uuid === 'string') {
          const resolvedStory = relsMap.get(uuid);
          if (resolvedStory) {
            return resolvedStory;
          }
          return removeUnresolvedRelations ? null : uuid;
        }
        return uuid;
      })
      .filter((item) => item !== null);

    return resolved;
  }

  return field;
}

/**
 * Resolves links in a story object
 */
function resolveStoryLinks(
  story: StoryblokStory<StoryblokComponent>,
  linksMap: Map<string, StoryblokStory<StoryblokComponent>>,
): StoryblokStory<StoryblokComponent> {
  if (!story.content) {
    return story;
  }

  const resolvedStory = { ...story };
  resolvedStory.content = resolveObjectLinks(
    story.content as unknown as Record<string, unknown>,
    linksMap,
  ) as unknown as StoryblokComponent;

  return resolvedStory;
}

/**
 * Resolves links in an object recursively
 */
function resolveObjectLinks(
  obj: unknown,
  linksMap: Map<string, StoryblokStory<StoryblokComponent>>,
): unknown {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => resolveObjectLinks(item, linksMap));
  }

  const resolved = { ...obj } as Record<string, unknown>;

  // Handle multilink fields
  if (resolved.fieldtype === 'multilink' && typeof resolved.id === 'string') {
    const linkedStory = linksMap.get(resolved.id);
    if (linkedStory) {
      resolved.story = linkedStory;
    }
  }

  // Recursively process nested objects
  Object.keys(resolved).forEach((key) => {
    resolved[key] = resolveObjectLinks(resolved[key], linksMap);
  });

  return resolved;
}
