import Link from 'next/link';
import type { ComponentProps, FC } from 'react';

type NextLinkProps = Omit<
  ComponentProps<typeof Link>,
  'className' | 'href' | 'preload'
> & {
  linktype?: string;
  href?: string;
  target?: string;
  anchor?: string;
  uuid?: string;
  custom?: Record<string, unknown>;
};

export const NextLink: FC<NextLinkProps> = ({
  linktype,
  href,
  target,
  anchor,
  uuid,
  custom,
  ...props
}) => (
  <Link
    href={href || '#'}
    target={target}
    preload={false}
    className="text-blue-600 hover:text-blue-800 underline"
    {...props}
  />
);
