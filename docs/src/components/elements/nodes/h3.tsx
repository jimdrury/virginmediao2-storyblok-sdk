import type { ComponentProps, FC } from 'react';

type H3Props = Omit<ComponentProps<'h3'>, 'className'>;

export const H3: FC<H3Props> = (props) => (
  <h3 className="text-3xl font-bold mb-4 last:mb-0 text-pretty" {...props} />
);
