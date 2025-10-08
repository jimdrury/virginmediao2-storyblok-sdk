import type { BlokType } from '@virginmediao2/storyblok-sdk';
import type { OSS_BLOK } from '@/storyblok/bloks';
import { type BC, storyblokEditable } from '@/storyblok/engine';

export type OssTileGridBlok = BlokType<OSS_BLOK.TILE_GRID> & {
  content: Array<BlokType>;
};

export const OssTileGrid: BC<OssTileGridBlok> = ({
  blok: { content, ...blok },
  StoryblokComponent,
}) => (
  <div
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    {...storyblokEditable(blok)}
  >
    {content.map((blok) => (
      <StoryblokComponent key={blok._uid} blok={blok} />
    ))}
  </div>
);
