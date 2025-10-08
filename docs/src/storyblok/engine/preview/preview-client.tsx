'use client';

import { type FC, type ReactNode, useEffect, useState } from 'react';
import type { StoryblokRootProps } from '../engine.interface';
import { previewAction } from './preview-action';
import { useBridge } from './use-bridge';

export type PreviewClientProps = Omit<StoryblokRootProps, 'story'> & {
  children: ReactNode;
};

export const PreviewClient: FC<PreviewClientProps> = ({
  children,
  ...props
}) => {
  const [renderedStory, setRenderedStory] = useState<ReactNode>(children);
  const { story: bridgeStory } = useBridge();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Should not rerender on props change
  useEffect(() => {
    (async () => {
      if (bridgeStory) {
        const renderedStory = await previewAction({
          story: bridgeStory,
          version: 'draft',
          ...props,
        });

        setRenderedStory(renderedStory);
      }
    })();
  }, [bridgeStory]);

  return renderedStory;
};
