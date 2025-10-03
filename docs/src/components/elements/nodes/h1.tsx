import type { ComponentProps, FC } from 'react';

type H1Props = Omit<ComponentProps<'h1'>, 'className'>;

export const H1: FC<H1Props> = (props) => (
  <h1
    className="text-4xl md:text-5xl font-extrabold mb-6 last:mb-0 text-pretty"
    {...props}
  />
);
