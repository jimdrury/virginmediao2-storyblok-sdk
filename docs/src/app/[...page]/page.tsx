import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import type { FC } from 'react';
import { PreviewRoot, StoryblokRoot, StoryblokToolbar } from '@/storyblok';
import { getStory } from '@/storyblok/utils/get-story';

// export const generateStaticParams = async () => {
//   const links = await getAllLinks();
//   return links.map((link) => ({
//     page: link.real_path.split('/').filter(Boolean),
//   }));
// };

interface PageProps {
  params: Promise<{ page: string[] }>;
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
    const story = await getStory(slug, { version: 'draft' });
    return (
      <>
        <StoryblokToolbar />
        <PreviewRoot story={story} />
      </>
    );
  }

  const story = await getStory(slug);
  return (
    <>
      <StoryblokToolbar />
      <StoryblokRoot story={story} />
    </>
  );
};

export default Page;
