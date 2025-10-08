'use client';
import clsx from 'clsx';
import type { FC } from 'react';
import { StoryblokLogo } from './storyblok-logo';

interface StoryblokToolbarProps {
  handlerPath: string;
  draftMode: boolean | { cv: number; release: number };
}

export const StoryblokToolbar: FC<StoryblokToolbarProps> = ({
  handlerPath,
  draftMode,
}) => {
  return (
    <div className="fab">
      <button
        type="button"
        className={clsx({
          btn: true,
          'btn-lg': true,
          'btn-circle': true,
          'border-2': true,
          'border-neutral-content': draftMode,
          'btn-neutral': draftMode,
          'text-neutral-content': draftMode,
        })}
      >
        <StoryblokLogo className={'h-[20px]'} />
      </button>

      {!draftMode && (
        <a className="btn rounded-full" href={`${handlerPath}/draft/enable/`}>
          Enable draft mode
        </a>
      )}
      {draftMode && (
        <a className="btn rounded-full" href={`${handlerPath}/draft/disable/`}>
          Exit draft mode
        </a>
      )}
    </div>
  );
};
