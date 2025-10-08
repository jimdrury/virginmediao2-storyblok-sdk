import type { Metadata } from 'next';
import { type FC, Suspense } from 'react';
import { getAllLinks } from '@/storyblok/utils/get-all-links';
import { getStory } from '@/storyblok/utils/get-story';
import { PageBuilder } from './_components/page-builder';
import { PageSkeleton } from './_components/page-skeleton';

export const generateStaticParams = async () => {
  const links = await getAllLinks();
  return links.map((link) => ({
    page: link.real_path.split('/').filter(Boolean),
  }));
};

interface PageProps {
  params: Promise<{ page: string[] }>;
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const params = await props.params;
  const slug = params.page.join('/');
  const story = await getStory(slug).catch(() => null);

  if (!story) {
    return {};
  }

  return {
    title: story.name,
  };
};

const Page: FC<PageProps> = async ({ params }) => {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageBuilder params={params} />
    </Suspense>
  );
};

export default Page;
