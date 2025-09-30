import type { FC } from 'react';
import type {
  StoryblokEngineProps,
  StoryblokRootProps,
} from '../engine.interface';
import { previewAction } from './preview-action';
import { PreviewClient } from './preview-client';

export const initPreviewStory = (config: StoryblokEngineProps) => {
  globalThis.renderConfig = config;

  const PreviewStory: FC<StoryblokRootProps> = async ({ story, ...props }) => {
    const render = await previewAction({ story, ...props });
    return <PreviewClient {...props}>{render}</PreviewClient>;
  };

  return PreviewStory;
};
