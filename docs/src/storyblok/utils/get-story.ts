import type { GetStoryParams } from '@virginmediao2/storyblok-sdk';
import { cacheLife } from 'next/dist/server/use-cache/cache-life';
import { storyblokSdk } from '..';

export const getStory = async (slug: string, options?: GetStoryParams) => {
  'use cache';
  cacheLife('default');
  const story = await storyblokSdk.getStory(slug, options);
  return story.data.story;
};
