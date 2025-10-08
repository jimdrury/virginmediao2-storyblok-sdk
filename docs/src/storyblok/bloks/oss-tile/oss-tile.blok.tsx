import type { BlokType, StoryType } from '@virginmediao2/storyblok-sdk';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { Alert } from '@/components/alert';
import type { OSS_BLOK } from '@/storyblok/bloks';
import { type BC, storyblokEditable } from '@/storyblok/engine';

export interface StoryblokLinkField {
  id: string;
  url: string;
  linktype: 'story' | 'url' | 'email' | 'asset';
  fieldtype: string;
  cached_url: string;
  story?: StoryType;
}

export type OssTileBlok = BlokType<OSS_BLOK.TILE> & {
  title: string;
  description: string;
  link: StoryblokLinkField;
};

export const OssTile: BC<OssTileBlok> = ({
  blok: { description, link, ...blok },
}) => {
  if (!link.story) {
    return (
      <Alert
        title="Error"
        variant="error"
        decoration="outline"
        {...storyblokEditable(blok)}
      >
        Tiles must have a link.
      </Alert>
    );
  }

  return (
    <div
      className="card bg-base-100 w-96 shadow-sm max-w-full relative"
      {...storyblokEditable(blok)}
    >
      <div className="card-body">
        <div className="card-title text-wrap">{link.story.name}</div>

        {description && <p>{description}</p>}

        <div className="card-actions justify-end">
          <Link
            className="btn btn-circle before:content-[''] before:absolute before:inset-0 active:translate-none!"
            href={link.story.full_slug}
            prefetch={false}
          >
            <span className="sr-only">Read {link.story.name}</span>
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};
