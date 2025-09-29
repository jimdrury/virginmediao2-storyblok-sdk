import { initStoryblokPreviewEngine } from './engine';
import { previewAction } from './preview.action';

export const { PreviewStory } = initStoryblokPreviewEngine({
  previewAction,
});
