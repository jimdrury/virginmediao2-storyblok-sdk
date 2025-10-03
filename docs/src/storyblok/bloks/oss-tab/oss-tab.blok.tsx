import type { BlokType } from '@virginmediao2/storyblok-sdk/src';
import { TabPanel } from '@/components/tabs';
import type { OSS_BLOK } from '@/storyblok/bloks';
import type { BC } from '@/storyblok/engine';
import { storyblokEditable } from '@/storyblok/engine';

export type OssTabBlok = BlokType<OSS_BLOK.TAB> & {
  title: string;
  content: Array<BlokType>;
};

export const OssTab: BC<OssTabBlok> = ({
  blok: { title, content, ...blok },
  StoryblokComponent,
}) => (
  <div {...storyblokEditable(blok)}>
    <TabPanel tabId={blok._uid}>
      {content.map((blok) => (
        <StoryblokComponent key={blok._uid} blok={blok} />
      ))}
    </TabPanel>
  </div>
);
