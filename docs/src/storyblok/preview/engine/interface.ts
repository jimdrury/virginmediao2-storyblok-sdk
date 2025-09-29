import type { StoryblokStory } from '@virginmediao2/storyblok-sdk';
import type { ReactNode } from 'react';

export type PreviewAction = (props: {
  story: StoryblokStory;
}) => Promise<ReactNode>;
