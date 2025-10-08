import { notFound } from 'next/navigation';
import type { FC } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { getStory } from '@/storyblok/utils/get-story';

interface BreadcrumbsBuilderProps {
  params: Promise<{ page: string[] }>;
}

export const BreadcrumbsBuilder: FC<BreadcrumbsBuilderProps> = async (
  props,
) => {
  const params = await props.params;
  const slug = params.page.join('/');
  const story = await getStory(slug).catch(() => notFound());
  return <Breadcrumbs storyId={story.id} />;
};
