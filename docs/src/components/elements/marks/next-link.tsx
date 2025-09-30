import Link from 'next/link';
import type { ComponentProps, FC } from 'react';

type NextLinkProps = Omit<ComponentProps<typeof Link>, 'className' | 'preload'>;

export const NextLink: FC<NextLinkProps> = ({ href, ...props }) => (
  <Link
    href={href || '#'}
    prefetch={false}
    className="text-blue-600 hover:text-blue-800 underline"
    {...props}
  />
);
