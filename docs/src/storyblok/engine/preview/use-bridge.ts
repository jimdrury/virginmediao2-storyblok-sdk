'use client';

import StoryblokBridge from '@storyblok/preview-bridge';
import type { StoryblokStory } from '@virginmediao2/storyblok-sdk';
import { useLayoutEffect, useState } from 'react';

export const useBridge = () => {
  const [story, setStory] = useState<StoryblokStory>();

  useLayoutEffect(() => {
    const storyblokBridge = new StoryblokBridge();
    storyblokBridge.on('input', ({ story }) => {
      setStory(story as StoryblokStory);
    });
  });

  return story;
};
