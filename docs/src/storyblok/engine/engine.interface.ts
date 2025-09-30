import type {
  StoryblokComponent,
  StoryblokStory,
} from '@virginmediao2/storyblok-sdk/src';
import type { FC } from 'react';

export interface RenderComponentProps {
  blok: StoryblokComponent;
}

export interface BlokComponentProps<
  T extends StoryblokComponent = StoryblokComponent,
> {
  blok: T;
  RenderComponent: FC<RenderComponentProps>;
}

export type BlokComponent<T extends StoryblokComponent = StoryblokComponent> =
  FC<BlokComponentProps<T>>;

export type BC<T extends StoryblokComponent = StoryblokComponent> =
  BlokComponent<T>;

export interface StoryblokEngineProps {
  components: Record<string, BC<never>>;
}

export interface RenderActionProps {
  story: StoryblokStory<StoryblokComponent>;
}
