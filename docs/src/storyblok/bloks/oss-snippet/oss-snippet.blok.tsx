import type { BlokType } from '@virginmediao2/storyblok-sdk/src';
import { CodeSnippet, type LANGUAGE } from '@/components/code-snippet';
import type { BLOK } from '@/storyblok/bloks';
import type { BC } from '@/storyblok/engine';
import { storyblokEditable } from '@/storyblok/engine';

export type OssSnippetBlok = BlokType<BLOK.OSS_SNIPPET> & {
  code: {
    code: string;
    title?: string;
    language?: LANGUAGE;
  };
};

export const OssSnippet: BC<OssSnippetBlok> = ({ blok: { code, ...blok } }) => (
  <div {...storyblokEditable(blok)}>
    <CodeSnippet code={code.code} title={code.title} language={code.language} />
  </div>
);
