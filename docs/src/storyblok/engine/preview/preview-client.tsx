'use client';

import { type FC, type ReactNode, useEffect, useState } from 'react';
import { previewAction } from './preview-action';
import { useBridge } from './use-bridge';

export interface PreviewClientProps {
  children: ReactNode;
}

export const PreviewClient: FC<PreviewClientProps> = ({ children }) => {
  const [renderedStory, setRenderedStory] = useState<ReactNode>(children);
  const bridgeStory = useBridge();

  useEffect(() => {
    (async () => {
      if (!bridgeStory) {
        return;
      }

      // NOTE: We may possibly need to dyanmically import this preview action
      // for librarfication
      const renderedStory = await previewAction(bridgeStory);
      setRenderedStory(renderedStory);
    })();
  }, [bridgeStory]);

  return renderedStory;
};
