import type { GetLinksParams } from '@virginmediao2/storyblok-sdk';
import { cacheLife } from 'next/dist/server/use-cache/cache-life';
import { storyblokSdk } from '..';

export const getAllLinks = async (
  params?: Omit<GetLinksParams, 'page' | 'per_page'>,
  options?: {
    perPage?: number;
    maxPages?: number;
    onProgress?: (page: number, totalFetched: number, total?: number) => void;
  },
) => {
  'use cache';
  cacheLife('default');

  const links = await storyblokSdk.getAllLinks(params, options);
  return links;
};
