import type { BlokType } from '@virginmediao2/storyblok-sdk/src';
import { Tab, Tabs, TabsProvider } from '@/components/tabs';
import type { BLOK } from '@/storyblok/bloks';
import type { OssTabBlok } from '@/storyblok/bloks/oss-tab/oss-tab.blok';
import type { BC } from '@/storyblok/engine';
import { storyblokEditable } from '@/storyblok/engine';

export type OssTabsBlok = BlokType<BLOK.OSS_TABS> & {
  tabs: Array<OssTabBlok>;
};

export const OssTabs: BC<OssTabsBlok> = ({
  blok: { tabs, ...blok },
  StoryblokComponent,
}) => {
  const firstTab = tabs[0];

  return (
    <div {...storyblokEditable(blok)}>
      <TabsProvider defaultActiveTab={firstTab._uid}>
        <Tabs variant="border">
          {tabs.map((tab) => (
            <Tab key={`tab-${tab._uid}`} tabId={tab._uid}>
              {tab.title}
            </Tab>
          ))}
        </Tabs>

        <div className="mt-2">
          {tabs.map((blok) => (
            <StoryblokComponent key={blok._uid} blok={blok} />
          ))}
        </div>
      </TabsProvider>
    </div>
  );
};
