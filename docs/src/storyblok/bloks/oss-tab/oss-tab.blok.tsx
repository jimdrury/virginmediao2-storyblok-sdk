import type { StoryblokComponent } from '@virginmediao2/storyblok-sdk';
import { TabPanel } from '@/components/tabs';
import type { BLOK } from '@/storyblok/bloks';
import type { BC } from '@/storyblok/engine';
import { storyblokEditable } from '@/storyblok/engine/storyblok-editable';

export type OssTabBlok = StoryblokComponent<BLOK.OSS_TAB> & {
  title: string;
  content: Array<StoryblokComponent>;
};

export const OssTab: BC<OssTabBlok> = ({
  blok: { title, content, ...blok },
  RenderComponent,
}) => (
  <div {...storyblokEditable(blok)}>
    <TabPanel tabId={blok._uid}>
      {content.map((blok) => (
        <RenderComponent key={blok._uid} blok={blok} />
      ))}
    </TabPanel>
  </div>
);
