import type { FC } from 'react';
import type {
  StoryblokEngineProps,
  StoryblokRootProps,
} from '../engine.interface';
import { previewAction } from './preview-action';
import { PreviewClient } from './preview-client';

export const initPreviewRoot = (config: StoryblokEngineProps) => {
  globalThis.renderConfig = config;

  const PreviewRoot: FC<StoryblokRootProps> = async ({ story, ...props }) => {
    const render = await previewAction({ story, ...props });
    return <PreviewClient {...props}>{render}</PreviewClient>;
  };

  return PreviewRoot;
};
