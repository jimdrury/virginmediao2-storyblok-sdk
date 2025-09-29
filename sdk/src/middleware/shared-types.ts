import type {
  StoryblokStoriesResponse,
  StoryblokStory,
  StoryblokStoryResponse,
} from '../types';

export interface StoryblokStoriesResponseWithRels
  extends Omit<StoryblokStoriesResponse, 'rels'> {
  rels: StoryblokStory[];
}

export interface StoryblokStoryResponseWithRels
  extends Omit<StoryblokStoryResponse, 'rels'> {
  rels: StoryblokStory[];
}

export interface StoryblokStoriesResponseWithLinks
  extends Omit<StoryblokStoriesResponse, 'links'> {
  links: StoryblokStory[];
}

export interface StoryblokStoryResponseWithLinks
  extends Omit<StoryblokStoryResponse, 'links'> {
  links: StoryblokStory[];
}

export type StoryblokApiResponseWithStoryRels =
  | StoryblokStoriesResponseWithRels
  | StoryblokStoryResponseWithRels;

export type StoryblokApiResponseWithStoryLinks =
  | StoryblokStoriesResponseWithLinks
  | StoryblokStoryResponseWithLinks;
