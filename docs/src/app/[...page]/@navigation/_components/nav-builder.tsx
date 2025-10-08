import type { FC } from 'react';
import { NavigationTree } from '@/components/navigation-tree';
import { getAllLinksWithFolders } from '@/storyblok/utils/get-all-links';

interface NavBuilderProps {
  params: Promise<{ page: string[] }>;
}

export const NavBuilder: FC<NavBuilderProps> = async (props) => {
  'use cache';
  const params = await props.params;
  const slug = params.page.join('/');

  const links = await getAllLinksWithFolders();

  return <NavigationTree links={links} currentSlug={slug} />;
};
