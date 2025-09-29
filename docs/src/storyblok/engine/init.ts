import type { StoryblokEngineProps } from './engine.interface';
import { initRenderStory } from './render-story';
import { storyblokEditable } from './storyblok-editable';

export const initStoryblokEngine = (props: StoryblokEngineProps) => {
  const RenderStory = initRenderStory(props);

  return {
    RenderStory,
    storyblokEditable,
  };
};
