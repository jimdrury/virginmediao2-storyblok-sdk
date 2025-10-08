import type { GetLinksParams } from '@virginmediao2/storyblok-sdk/src';
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
  return links
    .filter((link) => !link.real_path.includes('_common'))
    .filter((link) => link.is_folder === false);
};

export const getAllLinksWithFolders = async (
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
  return links.filter((link) => !link.real_path.includes('_common'));
};
