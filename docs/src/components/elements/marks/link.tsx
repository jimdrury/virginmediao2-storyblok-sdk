import type { ComponentProps, FC } from 'react';

type LinkProps = Omit<ComponentProps<'a'>, 'className'>;

export const Link: FC<LinkProps> = ({ href, target, ...props }) => (
  <a
    className="text-blue-600 hover:text-blue-800 underline"
    href={href}
    target={target}
    {...props}
  />
);
