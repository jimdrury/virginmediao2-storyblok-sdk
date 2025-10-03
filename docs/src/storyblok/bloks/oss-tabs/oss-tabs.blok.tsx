import type { BlokType } from '@virginmediao2/storyblok-sdk/src';
import { Tab, Tabs, TabsProvider } from '@/components/tabs';
import type { OSS_BLOK } from '@/storyblok/bloks';
import type { OssTabBlok } from '@/storyblok/bloks/oss-tab/oss-tab.blok';
import type { BC } from '@/storyblok/engine';
import { storyblokEditable } from '@/storyblok/engine';

export type OssTabsBlok = BlokType<OSS_BLOK.TABS> & {
  label: string;
  tabs: Array<OssTabBlok>;
  variant?: 'border' | 'box' | 'lift';
};

export const OssTabs: BC<OssTabsBlok> = ({
  blok: { tabs, label, variant = 'border', ...blok },
  StoryblokComponent,
}) => {
  const firstTab = tabs[0];

  return (
    <div {...storyblokEditable(blok)}>
      <TabsProvider defaultActiveTab={firstTab._uid}>
        <Tabs label={label} variant={variant}>
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
