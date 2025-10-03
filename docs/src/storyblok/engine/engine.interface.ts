import type { BlokType, StoryType } from '@virginmediao2/storyblok-sdk';
import type { FC } from 'react';

export interface StoryblokRootProps {
  story: StoryType<BlokType>;
  version: 'published' | 'draft';
  [rootContextProp: string]: unknown;
}

export type StoryblokPreviewRootProps = StoryblokRootProps & {
  cv?: number;
  from_release?: number;
  version: 'draft';
};

export type StoryblokContextProps<T = Record<string, unknown>> = (
  | StoryblokRootProps
  | StoryblokPreviewRootProps
) &
  Partial<T>;

export interface StoryblokComponentProps {
  blok: BlokType;
  [localContextProp: string]: unknown;
}

export interface BlokComponentProps<
  T extends BlokType = BlokType,
  C = Record<string, unknown>,
> {
  blok: T;
  context: StoryblokContextProps<C>;
  StoryblokComponent: FC<StoryblokComponentProps>;
}

export type BlokComponent<
  T extends BlokType = BlokType,
  C = Record<string, unknown>,
> = FC<BlokComponentProps<T, C>>;

export type BC<
  T extends BlokType = BlokType,
  C = Record<string, unknown>,
> = BlokComponent<T, C>;

export interface StoryblokEngineProps {
  handlerPath: `/${string}`;
  components: Record<string, BC<never>>;
}
