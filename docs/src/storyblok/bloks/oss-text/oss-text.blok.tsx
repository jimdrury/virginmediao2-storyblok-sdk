import type { StoryblokComponent } from '@virginmediao2/storyblok-sdk';
import type { StoryblokRichtext } from 'storyblok-rich-text-react-renderer';
import { RichText } from '@/components/rich-text';
import type { BLOK } from '@/storyblok/bloks';
import type { BC } from '@/storyblok/engine';
import { storyblokEditable } from '@/storyblok/engine/storyblok-editable';

export type OssTextBlok = StoryblokComponent<BLOK.OSS_TEXT> & {
  content: StoryblokRichtext;
};

export const OssText: BC<OssTextBlok> = ({ blok: { content, ...blok } }) => (
  <div {...storyblokEditable(blok)}>
    <RichText content={content} />
  </div>
);
