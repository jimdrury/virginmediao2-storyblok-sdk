import type {
  StoryblokComponent,
  StoryblokStoriesResponse,
  StoryblokStory,
  StoryblokStoryResponse,
} from '../types';

export interface StoryblokStoriesResponseWithRels<
  T extends StoryblokComponent = StoryblokComponent,
> extends Omit<StoryblokStoriesResponse<T>, 'rels'> {
  rels: StoryblokStory<T>[];
}

export interface StoryblokStoryResponseWithRels<
  T extends StoryblokComponent = StoryblokComponent,
> extends Omit<StoryblokStoryResponse<T>, 'rels'> {
  rels: StoryblokStory<T>[];
}

export interface StoryblokStoriesResponseWithLinks<
  T extends StoryblokComponent = StoryblokComponent,
> extends Omit<StoryblokStoriesResponse<T>, 'links'> {
  links: StoryblokStory<T>[];
}

export interface StoryblokStoryResponseWithLinks<
  T extends StoryblokComponent = StoryblokComponent,
> extends Omit<StoryblokStoryResponse<T>, 'links'> {
  links: StoryblokStory<T>[];
}

export type StoryblokApiResponseWithStoryRels<
  T extends StoryblokComponent = StoryblokComponent,
> = StoryblokStoriesResponseWithRels<T> | StoryblokStoryResponseWithRels<T>;

export type StoryblokApiResponseWithStoryLinks<
  T extends StoryblokComponent = StoryblokComponent,
> = StoryblokStoriesResponseWithLinks<T> | StoryblokStoryResponseWithLinks<T>;
