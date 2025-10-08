'use client';

import StoryblokBridge, {
  type InputBridgeEvent,
} from '@storyblok/preview-bridge';
import type { StoryType } from '@virginmediao2/storyblok-sdk';
import { useCallback, useState } from 'react';
import { useEffectOnce } from 'react-use';

export const useBridge = () => {
  const [story, setStory] = useState<StoryType>();
  const [inEditMode, setInEditMode] = useState(false);

  const onStoryUpdate = useCallback((event: InputBridgeEvent) => {
    const existingStoryStr = JSON.stringify(event);
    const newStoryStr = JSON.stringify(event.story);
    if (existingStoryStr !== newStoryStr) {
      setStory(event.story as StoryType);
    }
  }, []);

  const onEnterEditMode = useCallback(() => {
    setInEditMode(true);
  }, []);

  useEffectOnce(() => {
    const bridge = new StoryblokBridge({
      resolveLinks: 'story',
      preventClicks: true,
      initOnlyOnce: true,
    });

    bridge.on('input', onStoryUpdate);
    bridge.on('enterEditmode', onEnterEditMode);
  });

  return {
    story,
    inEditMode,
  };
};
