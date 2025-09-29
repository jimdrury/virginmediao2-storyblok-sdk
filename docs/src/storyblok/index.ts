import {
  StoryblokSdk,
  storyblokBasePath,
  storyblokCdnAuth,
  storyblokLinksResolver,
  storyblokRelationsResolver,
} from '@virginmediao2/storyblok-sdk';
import { STORYBLOK } from '@/environment/storyblok';

export const storyblokSdk = new StoryblokSdk({
  middlewares: [
    storyblokCdnAuth({ accessToken: STORYBLOK.ACCESS_TOKEN }),
    storyblokLinksResolver({ resolveLinks: 'link' }),
    storyblokRelationsResolver({ resolveRelations: [] }),
    storyblokBasePath({ basePath: 'en/oss-storyblok-sdk/' }),
  ],
});
