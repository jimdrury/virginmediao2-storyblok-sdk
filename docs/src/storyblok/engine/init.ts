import type { StoryblokEngineProps } from './engine.interface';
import { initPreviewStory } from './preview';
import { initRenderStory } from './render-story';
import { storyblokEditable } from './storyblok-editable';

declare global {
  var renderConfig: StoryblokEngineProps;
}

export const initStoryblokEngine = (props: StoryblokEngineProps) => {
  const RenderStory = initRenderStory(props);
  const PreviewStory = initPreviewStory(props);

  return {
    RenderStory,
    PreviewStory,
    storyblokEditable,
  };
};
