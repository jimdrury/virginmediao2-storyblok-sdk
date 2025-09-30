import type { StoryblokComponent } from '@virginmediao2/storyblok-sdk/src';
import type { OSS_BLOK } from '@/storyblok/bloks';
import type { BC } from '@/storyblok/engine';

export type OssPageBlok = StoryblokComponent<OSS_BLOK.PAGE> & {
  content: Array<StoryblokComponent>;
};

export const OssPage: BC<OssPageBlok> = ({ blok, RenderComponent }) => (
  <div className="flex flex-col gap-4">
    {blok.content.map((blok) => (
      <RenderComponent key={blok._uid} blok={blok} />
    ))}
  </div>
);
