'use server';

import type { ReactNode } from 'react';
import type { StoryblokRootProps } from '../engine.interface';
import { initStoryblokRoot } from '../render/storyblok-root';

export type PreviewAction = (props: StoryblokRootProps) => Promise<ReactNode>;

export const previewAction: PreviewAction = async ({
  story,
  version = 'published',
  cv,
  from_release,
  ...props
}) => {
  const StoryblokRoot = initStoryblokRoot(globalThis.renderConfig);
  return (
    <StoryblokRoot
      version={version}
      story={story}
      cv={cv}
      from_release={from_release}
      {...props}
    />
  );
};
