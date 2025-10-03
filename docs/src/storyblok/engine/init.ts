import type { StoryblokEngineProps } from './engine.interface';
import { initPreviewRoot } from './preview';
import { initStoryblokRoot } from './render';
import { initStoryblokToolbar } from './toolbar';

declare global {
  var renderConfig: StoryblokEngineProps;
}

export const initStoryblokEngine = (props: StoryblokEngineProps) => ({
  StoryblokRoot: initStoryblokRoot(props),
  PreviewRoot: initPreviewRoot(props),
  StoryblokToolbar: initStoryblokToolbar(props),
});
