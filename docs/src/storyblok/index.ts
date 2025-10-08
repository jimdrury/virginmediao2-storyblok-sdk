import {
  StoryblokSdk,
  storyblokCdnConfig,
  storyblokPathConfig,
  storyblokResolverConfig,
} from '@virginmediao2/storyblok-sdk';
import { STORYBLOK } from '@/environment/storyblok';
import { OSS_BLOK } from './bloks';
import OssCallout from './bloks/oss-callout';
import OssDivider from './bloks/oss-divider';
import OssObjectParam from './bloks/oss-object-param';
import OssObjectParamOption from './bloks/oss-object-param-option';
import OssPage from './bloks/oss-page';
import OssSnippet from './bloks/oss-snippet';
import OssTab from './bloks/oss-tab';
import OssTabs from './bloks/oss-tabs';
import OssText from './bloks/oss-text';
import OssTile from './bloks/oss-tile';
import OssTileGrid from './bloks/oss-tile-grid';
import OssTimeline from './bloks/oss-timeline';
import OssTimelineItem from './bloks/oss-timeline-item';
import { initStoryblokEngine } from './engine';

export const storyblokSdk = new StoryblokSdk({
  accessToken: STORYBLOK.ACCESS_TOKEN,
  middlewares: [
    storyblokCdnConfig({
      assetDomain: 'https://storyblok.cdn.vmo2digital.co.uk',
      allowedSpaceIds: ['329767'],
    }),
    storyblokPathConfig({
      folderPath: 'en/oss-storyblok-sdk/',
      htmlBasePath: '/virginmediao2-storyblok-sdk',
      rewriteLinks: true,
    }),
    storyblokResolverConfig({
      resolveLinks: 'story',
      resolveRelations: [],
      removeUnresolvedRelations: false,
    }),
  ],
});

export const {
  StoryblokRoot,
  PreviewRoot,
  StoryblokToolbar,
  draftMode,
  routeHandler,
} = initStoryblokEngine({
  draftInReleaseOnly: true,
  handlerPath: '/virginmediao2-storyblok-sdk/storyblok',
  components: {
    [OSS_BLOK.PAGE]: OssPage,
    [OSS_BLOK.PAGE_WITH_NAVIGATION]: OssPage,
    [OSS_BLOK.SNIPPET]: OssSnippet,
    [OSS_BLOK.TABS]: OssTabs,
    [OSS_BLOK.TAB]: OssTab,
    [OSS_BLOK.TEXT]: OssText,
    [OSS_BLOK.TIMELINE]: OssTimeline,
    [OSS_BLOK.TIMELINE_ITEM]: OssTimelineItem,
    [OSS_BLOK.DIVIDER]: OssDivider,
    [OSS_BLOK.CALLOUT]: OssCallout,
    [OSS_BLOK.OBJECT_PARAM]: OssObjectParam,
    [OSS_BLOK.OBJECT_PARAM_OPTION]: OssObjectParamOption,
    [OSS_BLOK.TILE_GRID]: OssTileGrid,
    [OSS_BLOK.TILE]: OssTile,
  },
});
