import type {
  StoryblokComponent,
  StoryblokStory,
} from '@virginmediao2/storyblok-sdk';
import type { FC } from 'react';
import type { StoryblokEngineProps } from '../engine.interface';
import { previewAction } from './preview-action';
import { PreviewClient } from './preview-client';

export interface PreviewStoryProps {
  story: StoryblokStory<StoryblokComponent>;
}

export const initPreviewStory = (config: StoryblokEngineProps) => {
  globalThis.renderConfig = config;

  const PreviewStory: FC<PreviewStoryProps> = async ({ story }) => {
    const render = await previewAction(story);
    return <PreviewClient>{render}</PreviewClient>;
  };

  return PreviewStory;
};
