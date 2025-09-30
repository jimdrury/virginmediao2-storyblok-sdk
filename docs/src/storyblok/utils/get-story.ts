import type { GetStoryParams } from '@virginmediao2/storyblok-sdk/src';
import { storyblokSdk } from '..';

export const getStory = async (slug: string, options?: GetStoryParams) => {
  const links = await storyblokSdk.getStory(slug, options);
  return links.data.story;
};
