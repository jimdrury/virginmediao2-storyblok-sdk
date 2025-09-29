import type { PreviewAction } from './interface';
import { initPreviewStory } from './preview-story';

export * from './interface';
export * from './preview-story';

interface StoryblokPreviewEngineProps {
  previewAction: PreviewAction;
}

export const initStoryblokPreviewEngine = (
  props: StoryblokPreviewEngineProps,
) => {
  return {
    PreviewStory: initPreviewStory(props),
  };
};
