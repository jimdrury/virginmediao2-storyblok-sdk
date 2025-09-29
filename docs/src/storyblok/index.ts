import {
  StoryblokSdk,
  storyblokBasePath,
  storyblokCdnAuth,
  storyblokCdnDomain,
  storyblokLinksResolver,
  storyblokRelationsResolver,
} from '@virginmediao2/storyblok-sdk';
import { STORYBLOK } from '@/environment/storyblok';

export const storyblokSdk = new StoryblokSdk({
  middlewares: [
    storyblokCdnAuth({ accessToken: STORYBLOK.ACCESS_TOKEN }),
    storyblokBasePath({
      basePath: 'en/oss-storyblok-sdk/',
      rewriteLinks: true,
    }),
    storyblokLinksResolver({ resolveLinks: 'story' }),
    storyblokRelationsResolver({ resolveRelations: [] }),
    storyblokCdnDomain({
      assetDomain: 'https://storyblok.cdn.vmo2digital.co.uk',
      allowedSpaceIds: ['329767'],
    }),
  ],
});
