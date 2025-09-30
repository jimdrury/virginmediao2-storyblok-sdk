import {
  StoryblokSdk,
  storyblokCdnConfig,
  storyblokPathConfig,
  storyblokResolverConfig,
} from '@virginmediao2/storyblok-sdk';
import { STORYBLOK } from '@/environment/storyblok';
import { BLOK } from './bloks';
import OssPage from './bloks/oss-page';
import OssSnippet from './bloks/oss-snippet';
import OssTab from './bloks/oss-tab';
import OssTabs from './bloks/oss-tabs';
import OssText from './bloks/oss-text';
import { initStoryblokEngine } from './engine';

export const storyblokSdk = new StoryblokSdk({
  middlewares: [
    storyblokCdnConfig({
      accessToken: STORYBLOK.ACCESS_TOKEN,
      assetDomain: 'https://storyblok.cdn.vmo2digital.co.uk',
      allowedSpaceIds: ['329767'],
    }),
    storyblokPathConfig({
      basePath: 'en/oss-storyblok-sdk/',
      rewriteLinks: true,
    }),
    storyblokResolverConfig({
      resolveLinks: 'story',
      resolveRelations: [],
      removeUnresolvedRelations: false,
    }),
  ],
});

export const { StoryblokRoot, PreviewStory, storyblokEditable } =
  initStoryblokEngine({
    components: {
      [BLOK.OSS_SNIPPET]: OssSnippet,
      [BLOK.OSS_PAGE]: OssPage,
      [BLOK.OSS_TABS]: OssTabs,
      [BLOK.OSS_TAB]: OssTab,
      [BLOK.OSS_TEXT]: OssText,
    },
  });
