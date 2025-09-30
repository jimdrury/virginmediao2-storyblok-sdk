import {
  StoryblokSdk,
  storyblokCdnConfig,
  storyblokPathConfig,
  storyblokResolverConfig,
} from '@virginmediao2/storyblok-sdk';
import { STORYBLOK } from '@/environment/storyblok';
import { OSS_BLOK } from './bloks';
import OssPage from './bloks/oss-page';
import OssSnippet from './bloks/oss-snippet';
import OssTab from './bloks/oss-tab';
import OssTabs from './bloks/oss-tabs';
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

export const { RenderStory, PreviewStory } = initStoryblokEngine({
  components: {
    [OSS_BLOK.SNIPPET]: OssSnippet,
    [OSS_BLOK.PAGE]: OssPage,
    [OSS_BLOK.TABS]: OssTabs,
    [OSS_BLOK.TAB]: OssTab,
  },
});
