import type { StoryblokEngineProps } from './engine.interface';
import { initPreviewRoot } from './preview';
import { initStoryblokRoot } from './render';

declare global {
  var renderConfig: StoryblokEngineProps;
}

export const initStoryblokEngine = (props: StoryblokEngineProps) => {
  const StoryblokRoot = initStoryblokRoot(props);
  const PreviewRoot = initPreviewRoot(props);

  return {
    StoryblokRoot,
    PreviewRoot,
  };
};
