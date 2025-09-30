import type { StoryblokEngineProps } from './engine.interface';
import { initPreviewStory } from './preview';
import { initStoryblokRoot } from './render';

declare global {
  var renderConfig: StoryblokEngineProps;
}

export const initStoryblokEngine = (props: StoryblokEngineProps) => {
  const StoryblokRoot = initStoryblokRoot(props);
  const PreviewStory = initPreviewStory(props);

  return {
    StoryblokRoot,
    PreviewStory,
  };
};
