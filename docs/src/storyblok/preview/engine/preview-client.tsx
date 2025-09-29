'use client';

import type { StoryblokStory } from '@virginmediao2/storyblok-sdk';
import { type FC, type ReactNode, useEffect, useState } from 'react';
import { useBridge } from './use-bridge';

export interface PreviewClientProps {
  children: ReactNode;
  previewAction: (props: { story: StoryblokStory }) => Promise<ReactNode>;
}

export const PreviewClient: FC<PreviewClientProps> = ({
  children,
  previewAction,
}) => {
  const [renderedStory, setRenderedStory] = useState<ReactNode>(children);
  const bridgeStory = useBridge();

  useEffect(() => {
    bridgeStory &&
      previewAction({ story: bridgeStory }).then((renderedStory) =>
        setRenderedStory(renderedStory),
      );
  }, [bridgeStory, previewAction]);

  return renderedStory;
};
