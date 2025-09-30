'use server';

import type {
  StoryblokComponent,
  StoryblokStory,
} from '@virginmediao2/storyblok-sdk/src';
import { initRenderStory } from '../render/render-story';

export async function previewAction(story: StoryblokStory<StoryblokComponent>) {
  const RenderStory = initRenderStory(globalThis.renderConfig);

  return <RenderStory story={story} />;
}
