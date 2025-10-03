'use client';
import type { FC } from 'react';
import { PreviewButton } from './preview-button';

interface StoryblokToolbarProps {
  handlerPath: string;
  draftMode: boolean;
}

export const StoryblokToolbar: FC<StoryblokToolbarProps> = ({
  handlerPath,
  draftMode,
}) => {
  return (
    <div className="fixed bottom-[20px] right-[20px] z-50">
      {draftMode === false && (
        <PreviewButton href={`${handlerPath}/draft/enable`} enabled>
          Edit Mode
        </PreviewButton>
      )}
      {draftMode === true && (
        <PreviewButton href={`${handlerPath}/draft/disable`}>
          Exit Edit Mode
        </PreviewButton>
      )}
    </div>
  );
};
