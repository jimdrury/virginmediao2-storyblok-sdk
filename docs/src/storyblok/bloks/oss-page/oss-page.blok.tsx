import type { BlokType } from '@virginmediao2/storyblok-sdk/src';
import type { BLOK } from '@/storyblok/bloks';
import type { BC } from '@/storyblok/engine';

export type OssPageBlok = BlokType<BLOK.OSS_PAGE> & {
  content: Array<BlokType>;
};

export const OssPage: BC<OssPageBlok> = ({ blok, StoryblokComponent }) => (
  <div className="flex flex-col gap-4">
    {blok.content.map((blok) => (
      <StoryblokComponent key={blok._uid} blok={blok} />
    ))}
  </div>
);
