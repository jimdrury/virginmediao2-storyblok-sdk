import type { StoryblokStory } from '@virginmediao2/storyblok-sdk';
import { RenderStory } from '@/storyblok';

interface PreviewActionProps {
  story: StoryblokStory;
}

export const previewAction = async ({ story }: PreviewActionProps) => {
  'use server';
  return <RenderStory story={story} />;
};
