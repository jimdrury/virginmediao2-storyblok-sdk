import type { StoryblokComponent } from '@virginmediao2/storyblok-sdk/src';
import { TabPanel } from '@/components/tabs';
import type { OSS_BLOK } from '@/storyblok/bloks';
import type { BC } from '@/storyblok/engine';
import { storyblokEditable } from '@/storyblok/engine/render/storyblok-editable';

export type OssTabBlok = StoryblokComponent<OSS_BLOK.TAB> & {
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
