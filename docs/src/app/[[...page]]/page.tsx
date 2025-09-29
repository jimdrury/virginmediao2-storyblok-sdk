import type { FC } from 'react';
import { getAllLinks } from '@/storyblok/utils/get-all-links';
import { getStory } from '@/storyblok/utils/get-story';

export const generateStaticParams = async () => {
  const links = await getAllLinks();
  return links.map((link) => ({
    page: link.real_path.split('/'),
  }));
};

interface PageProps {
  params: Promise<{
    page: string[];
  }>;
}

const Page: FC<PageProps> = async (props) => {
  const params = await props.params;
  const slug = params.page?.join('/') ?? '/';
  const story = await getStory(slug);

  return <pre>{JSON.stringify(story, null, 2)}</pre>;
};

export default Page;
