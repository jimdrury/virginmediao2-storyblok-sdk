import type {
  StoryblokComponent,
  StoryblokStory,
} from '@virginmediao2/storyblok-sdk';
import type { FC } from 'react';
import type { PreviewAction } from './interface';
import { PreviewClient } from './preview-client';

export interface PreviewStoryProps {
  story: StoryblokStory<StoryblokComponent>;
}

export interface InitPreviewStoryProps {
  previewAction: PreviewAction;
}

export const initPreviewStory = ({ previewAction }: InitPreviewStoryProps) => {
  const PreviewStory: FC<PreviewStoryProps> = async ({ story }) => {
    const render = await previewAction({ story });
    return (
      <PreviewClient previewAction={previewAction}>{render}</PreviewClient>
    );
  };

  return PreviewStory;
};
