import type { GetStoryParams } from '@virginmediao2/storyblok-sdk';
import { unstable_cacheLife as cacheLife } from 'next/cache';
import { storyblokSdk } from '..';

export const getStory = async (slug: string, options?: GetStoryParams) => {
  'use cache';
  cacheLife('default');

  const links = await storyblokSdk.getStory(slug, options);
  return links.data.story;
};
