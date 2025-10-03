import {
  StoryblokSdk,
  storyblokCdnConfig,
  storyblokPathConfig,
  storyblokResolverConfig,
} from '@virginmediao2/storyblok-sdk';
import AxiosCurlirize from 'axios-curlirize';
import AxiosRetry from 'axios-retry';
import { STORYBLOK } from '@/environment/storyblok';
import { OSS_BLOK } from './bloks';
import OssDivider from './bloks/oss-divider';
import OssPage from './bloks/oss-page';
import OssSnippet from './bloks/oss-snippet';
import OssTab from './bloks/oss-tab';
import OssTabs from './bloks/oss-tabs';
import OssText from './bloks/oss-text';
import OssTimeline from './bloks/oss-timeline';
import OssTimelineItem from './bloks/oss-timeline-item';
import { initStoryblokEngine } from './engine';

export const storyblokSdk = new StoryblokSdk({
  middlewares: [
    AxiosCurlirize,
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
    (i) => AxiosRetry(i, { retries: 3 }),
  ],
});

export const { StoryblokRoot, PreviewRoot, StoryblokToolbar } =
  initStoryblokEngine({
    handlerPath: '/virginmediao2-storyblok-sdk/storyblok',
    components: {
      [OSS_BLOK.SNIPPET]: OssSnippet,
      [OSS_BLOK.PAGE]: OssPage,
      [OSS_BLOK.TABS]: OssTabs,
      [OSS_BLOK.TAB]: OssTab,
      [OSS_BLOK.TEXT]: OssText,
      [OSS_BLOK.TIMELINE]: OssTimeline,
      [OSS_BLOK.TIMELINE_ITEM]: OssTimelineItem,
      [OSS_BLOK.DIVIDER]: OssDivider,
    },
  });
