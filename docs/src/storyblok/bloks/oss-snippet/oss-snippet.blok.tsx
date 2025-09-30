import type { StoryblokComponent } from '@virginmediao2/storyblok-sdk';
import { CodeSnippet, type LANGUAGE } from '@/components/code-snippet';
import type { OSS_BLOK } from '@/storyblok/bloks';
import type { BC } from '@/storyblok/engine';
import { storyblokEditable } from '@/storyblok/engine/storyblok-editable';

export type OssSnippetBlok = StoryblokComponent<OSS_BLOK.SNIPPET> & {
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
