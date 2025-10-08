import type { BlokType } from '@virginmediao2/storyblok-sdk/src';
import type { StoryblokRichtext } from 'storyblok-rich-text-react-renderer';
import { Alert } from '@/components/alert';
import { RichText } from '@/components/rich-text';
import type { OSS_BLOK } from '@/storyblok/bloks';
import { type BC, storyblokEditable } from '@/storyblok/engine';

export type OssCalloutBlok = BlokType<OSS_BLOK.CALLOUT> & {
  title: string;
  content: StoryblokRichtext;
  variant?: 'info' | 'success' | 'warning' | 'error';
  decoration?: 'none' | 'outline' | 'dash' | 'soft';
};

export const OssCallout: BC<OssCalloutBlok> = ({
  blok: { title, content, variant, decoration, ...blok },
}) => (
  <div {...storyblokEditable(blok)}>
    <Alert title={title} variant={variant} decoration={decoration}>
      <RichText content={content} />
    </Alert>
  </div>
);
