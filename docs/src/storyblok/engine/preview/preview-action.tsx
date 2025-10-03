'use server';

import type { ReactNode } from 'react';
import type {
  StoryblokPreviewRootProps,
  StoryblokRootProps,
} from '../engine.interface';
import { initStoryblokRoot } from '../render/storyblok-root';

export type PreviewAction = (
  props: StoryblokRootProps | StoryblokPreviewRootProps,
) => Promise<ReactNode>;

export const previewAction: PreviewAction = async (props) => {
  const StoryblokRoot = initStoryblokRoot(globalThis.renderConfig);
  return <StoryblokRoot {...props} />;
};
