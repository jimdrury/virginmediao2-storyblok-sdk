import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { StoryblokLogo } from './storyblok-logo';

export interface PreviewButtonProps {
  href: string;
  enabled?: boolean;
  children: ReactNode;
}

export const PreviewButton: FC<PreviewButtonProps> = ({
  href,
  enabled = false,
  children,
}) => {
  return (
    <a
      className={clsx(
        'flex flex-row items-center justify-center shadow-2xl no-wrap gap-2',
        'bg-white border-3 rounded-[99vw]',
        'px-4 py-2',
        'transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-blue-500',
        {
          'border-green-600 text-green-600': enabled,
          'hover:text-green-500 hover:border-green-500': enabled,
          'border-red-900 text-red-900': !enabled,
          'hover:text-red-600 hover:border-red-600': !enabled,
        },
      )}
      href={href}
    >
      <div>{children}</div>

      <div>
        <StoryblokLogo className={clsx('mt-[4px] w-[25px] h-[25px]')} />
      </div>
    </a>
  );
};
