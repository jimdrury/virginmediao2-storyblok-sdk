import type { ComponentProps, FC } from 'react';

type H4Props = Omit<ComponentProps<'h4'>, 'className'>;

export const H4: FC<H4Props> = (props) => (
  <h4 className="text-2xl font-bold mb-4 last:mb-0 text-pretty" {...props} />
);
