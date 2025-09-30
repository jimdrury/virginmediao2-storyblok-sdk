import type {
  BlokType,
  StoryblokStoriesResponse,
  StoryblokStoryResponse,
  StoryType,
} from '../types';

export interface StoryblokStoriesResponseWithRels<T extends BlokType = BlokType>
  extends Omit<StoryblokStoriesResponse<T>, 'rels'> {
  rels: StoryType<T>[];
}

export interface StoryblokStoryResponseWithRels<T extends BlokType = BlokType>
  extends Omit<StoryblokStoryResponse<T>, 'rels'> {
  rels: StoryType<T>[];
}

export interface StoryblokStoriesResponseWithLinks<
  T extends BlokType = BlokType,
> extends Omit<StoryblokStoriesResponse<T>, 'links'> {
  links: StoryType<T>[];
}

export interface StoryblokStoryResponseWithLinks<T extends BlokType = BlokType>
  extends Omit<StoryblokStoryResponse<T>, 'links'> {
  links: StoryType<T>[];
}

export type StoryblokApiResponseWithStoryRels<T extends BlokType = BlokType> =
  | StoryblokStoriesResponseWithRels<T>
  | StoryblokStoryResponseWithRels<T>;

export type StoryblokApiResponseWithStoryLinks<T extends BlokType = BlokType> =
  | StoryblokStoriesResponseWithLinks<T>
  | StoryblokStoryResponseWithLinks<T>;
