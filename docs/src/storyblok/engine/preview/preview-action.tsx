'use server';

import type { ReactNode } from 'react';
import type { StoryblokRootProps } from '../engine.interface';
import { initStoryblokRoot } from '../render/render-story';

export type PreviewAction = (props: StoryblokRootProps) => Promise<ReactNode>;

export const previewAction: PreviewAction = async (props) => {
  const StoryblokRoot = initStoryblokRoot(globalThis.renderConfig);
  return <StoryblokRoot {...props} />;
};
