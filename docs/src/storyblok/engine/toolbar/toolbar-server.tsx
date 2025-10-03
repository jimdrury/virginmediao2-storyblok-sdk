import { draftMode } from 'next/headers';
import type { FC } from 'react';
import type { StoryblokEngineProps } from '../engine.interface';
import { StoryblokToolbar } from './toolbar-client';

export const ServerToolbar: FC<StoryblokEngineProps> = async ({
  handlerPath,
}) => {
  const draft = await draftMode();
  return (
    <StoryblokToolbar handlerPath={handlerPath} draftMode={draft.isEnabled} />
  );
};
