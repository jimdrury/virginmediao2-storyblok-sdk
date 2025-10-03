import type { BlokType } from '@virginmediao2/storyblok-sdk';
import clsx from 'clsx';
import type { OSS_BLOK } from '@/storyblok/bloks';
import { type BC, storyblokEditable } from '@/storyblok/engine';
import type { Colors } from '@/storyblok/utils/coerce-colour';

export type OssDivider = BlokType<OSS_BLOK.DIVIDER> & {
  text: string;
  color: Colors;
};

export const OssDivider: BC<OssDivider> = ({
  blok: { color, text, ...props },
}) => (
  <div
    className={clsx({
      divider: true,
      'divider-neutral': color === 'neutral',
      'divider-primary': color === 'primary',
      'divider-secondary': color === 'secondary',
      'divider-accent': color === 'accent',
      'divider-success': color === 'success',
      'divider-warning': color === 'warning',
      'divider-info': color === 'info',
      'divider-error': color === 'error',
    })}
    {...storyblokEditable(props)}
  >
    {text}
  </div>
);
