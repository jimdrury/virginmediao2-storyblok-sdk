import type { ComponentProps, FC } from 'react';

type LinkProps = Omit<ComponentProps<'a'>, 'className' | 'href'> & {
  linktype?: string;
  href?: string;
  target?: string;
  anchor?: string;
  uuid?: string;
  custom?: Record<string, unknown>;
};

export const Link: FC<LinkProps> = ({
  linktype,
  href,
  target,
  anchor,
  uuid,
  custom,
  ...props
}) => (
  <a
    className="text-blue-600 hover:text-blue-800 underline"
    href={href}
    target={target}
    {...props}
  />
);
