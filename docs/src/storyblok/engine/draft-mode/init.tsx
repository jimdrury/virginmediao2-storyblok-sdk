import { disableDraftMode, enableDraftMode, getDraftMode } from './draft-mode';

export const initDraftMode = () => {
  return {
    get: getDraftMode,
    enable: enableDraftMode,
    disable: disableDraftMode,
  };
};
