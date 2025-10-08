import type { FC } from 'react';
import { initDraftMode } from '../draft-mode';
import type { StoryblokEngineProps } from '../engine.interface';
import { StoryblokToolbar } from './toolbar-client';

export const ServerToolbar: FC<StoryblokEngineProps> = async (options) => {
  const draftMode = initDraftMode();
  const draft = await draftMode.get();

  return (
    <StoryblokToolbar
      handlerPath={options.handlerPath}
      draftMode={draft.isEnabled}
    />
  );
};
