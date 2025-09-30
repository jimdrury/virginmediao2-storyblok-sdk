import type { ComponentProps, FC } from 'react';

type H2Props = Omit<ComponentProps<'h2'>, 'className'>;

export const H2: FC<H2Props> = (props) => (
  <h2 className="text-4xl font-bold mb-4 last:mb-0 text-pretty" {...props} />
);
