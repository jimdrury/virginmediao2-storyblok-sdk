import { notFound } from 'next/navigation';
import type { FC } from 'react';
import { draftMode, PreviewRoot, StoryblokRoot } from '@/storyblok';
import { getStory } from '@/storyblok/utils/get-story';

interface PageBuilderProps {
  params: Promise<{ page: string[] }>;
}

export const PageBuilder: FC<PageBuilderProps> = async (props) => {
  const params = await props.params;
  const slug = params.page.join('/');
  const draft = await draftMode.get();
  if (draft.isEnabled) {
    const { cv, from_release } = draft;

    const story = await getStory(slug, {
      cv,
      from_release,
      version: 'draft',
    }).catch(() => notFound());

    return (
      <PreviewRoot
        story={story}
        version="draft"
        cv={cv}
        from_release={from_release}
        slug={slug}
      />
    );
  }

  const story = await getStory(slug).catch(() => notFound());

  return <StoryblokRoot story={story} version="published" slug={slug} />;
};
