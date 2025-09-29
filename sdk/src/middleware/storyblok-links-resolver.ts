import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import type { StoryblokStory } from '../types';
import type { StoryblokApiResponseWithStoryLinks } from './shared-types';

export interface StoryblokLinksResolverConfig {
  resolveLinks: 'link' | 'url' | 'story';
}

export const storyblokLinksResolver =
  (options: StoryblokLinksResolverConfig) =>
  (axiosInstance: AxiosInstance): void => {
    axiosInstance.interceptors.request.use(
      (requestConfig: InternalAxiosRequestConfig) => {
        if (requestConfig.params?.resolve_links) {
          return requestConfig;
        }

        if (!isStoryblokCdnRequest(requestConfig)) {
          return requestConfig;
        }

        if (!requestConfig.params) {
          requestConfig.params = {};
        }

        requestConfig.params = {
          ...requestConfig.params,
          resolve_links: options.resolveLinks,
        };

        return requestConfig;
      },
      (error) => Promise.reject(error),
    );

    axiosInstance.interceptors.response.use(
      (response: AxiosResponse<StoryblokApiResponseWithStoryLinks>) => {
        if (!isStoryblokCdnResponse(response)) {
          return response;
        }

        const data = response.data;
        const links = data.links || [];

        const linksMap = new Map<string, StoryblokStory>();
        links.forEach((link) => {
          linksMap.set(link.uuid, link);
        });

        if ('story' in data && data.story) {
          data.story = resolveStoryLinks(data.story, linksMap);
        }

        if ('stories' in data && data.stories) {
          data.stories = data.stories.map((story) =>
            resolveStoryLinks(story, linksMap),
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

function resolveStoryLinks(
  story: StoryblokStory,
  linksMap: Map<string, StoryblokStory>,
): StoryblokStory {
  if (!story.content) {
    return story;
  }

  const resolvedStory = { ...story };
  resolvedStory.content = resolveObjectLinks(story.content, linksMap) as Record<
    string,
    unknown
  >;

  return resolvedStory;
}

function resolveObjectLinks(
  obj: unknown,
  linksMap: Map<string, StoryblokStory>,
): unknown {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => resolveObjectLinks(item, linksMap));
  }

  const resolved = { ...obj } as Record<string, unknown>;

  if (resolved.fieldtype === 'multilink' && typeof resolved.id === 'string') {
    const linkedStory = linksMap.get(resolved.id);
    if (linkedStory) {
      resolved.story = linkedStory;
    }
  }

  Object.keys(resolved).forEach((key) => {
    resolved[key] = resolveObjectLinks(resolved[key], linksMap);
  });

  return resolved;
}
