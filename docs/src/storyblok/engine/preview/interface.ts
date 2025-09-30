import type { StoryblokStory } from '@virginmediao2/storyblok-sdk/src';
import type { ReactNode } from 'react';

export type PreviewAction = (props: {
  story: StoryblokStory;
}) => Promise<ReactNode>;
