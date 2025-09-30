import type { BlokType, StoryType } from '@virginmediao2/storyblok-sdk';
import type { FC } from 'react';

export interface StoryblokRootProps {
  story: StoryType<BlokType>;
}

export interface StoryblokComponentProps {
  blok: BlokType;
}

export interface BlokComponentProps<T extends BlokType = BlokType> {
  blok: T;
  context: StoryblokRootProps;
  StoryblokComponent: FC<StoryblokComponentProps>;
}

export type BlokComponent<T extends BlokType = BlokType> = FC<
  BlokComponentProps<T>
>;

export type BC<T extends BlokType = BlokType> = BlokComponent<T>;

export interface StoryblokEngineProps {
  components: Record<string, BC<never>>;
}
