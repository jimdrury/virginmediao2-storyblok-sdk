import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import type { FC } from 'react';
import { PreviewRoot, StoryblokRoot, StoryblokToolbar } from '@/storyblok';
import { getAllLinks } from '@/storyblok/utils/get-all-links';
import { getStory } from '@/storyblok/utils/get-story';

export const generateStaticParams = async () => {
  const links = await getAllLinks();
  return links.map((link) => ({
    page: link.real_path.split('/').filter(Boolean),
  }));
};

interface PageProps {
  params: Promise<{ page: string[] }>;
  searchParams: Promise<
    Partial<{
      '_storyblok_tk[timestamp]': string;
      _storyblok_release: string;
    }>
  >;
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const params = await props.params;
  const slug = params.page.join('/');
  const story = await getStory(slug);

  if (!story) {
    return {};
  }

  return {
    title: story.name,
  };
};

const Page: FC<PageProps> = async (props) => {
  const params = await props.params;
  const draft = await draftMode();
  const slug = params.page.join('/');

  if (draft.isEnabled) {
    const searchParams = await props.searchParams;

    const cv = Number(searchParams['_storyblok_tk[timestamp]'] || 0);
    const from_release = Number(searchParams._storyblok_release || 0);

    const story = await getStory(slug, {
      version: 'draft',
      cv,
      from_release,
    });

    return (
      <>
        <StoryblokToolbar />
        <PreviewRoot
          story={story}
          cv={cv}
          from_release={from_release}
          version="draft"
        />
      </>
    );
  }

  const story = await getStory(slug);
  return (
    <>
      <StoryblokToolbar />
      <StoryblokRoot story={story} version="published" />
    </>
  );
};

export default Page;
