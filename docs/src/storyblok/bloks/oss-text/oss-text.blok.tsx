import type { BlokType } from '@virginmediao2/storyblok-sdk/src';
import type { StoryblokRichtext } from 'storyblok-rich-text-react-renderer';
import { RichText } from '@/components/rich-text';
import type { OSS_BLOK } from '@/storyblok/bloks';
import { type BC, storyblokEditable } from '@/storyblok/engine';

export type OssTextBlok = BlokType<OSS_BLOK.TEXT> & {
  content: StoryblokRichtext;
};

export const OssText: BC<OssTextBlok> = ({ blok: { content, ...blok } }) => (
  <div {...storyblokEditable(blok)}>
    <RichText content={content} />
  </div>
);
