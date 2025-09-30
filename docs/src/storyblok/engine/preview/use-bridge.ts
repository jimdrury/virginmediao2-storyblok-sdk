'use client';

import StoryblokBridge from '@storyblok/preview-bridge';
import type { StoryType } from '@virginmediao2/storyblok-sdk/src';
import { useLayoutEffect, useState } from 'react';

export const useBridge = () => {
  const [story, setStory] = useState<StoryType>();

  useLayoutEffect(() => {
    const storyblokBridge = new StoryblokBridge();
    storyblokBridge.on('input', ({ story }) => {
      setStory(story as StoryType);
    });
  });

  return story;
};
