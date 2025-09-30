import type { ComponentProps, FC } from 'react';

type H6Props = Omit<ComponentProps<'h6'>, 'className'>;

export const H6: FC<H6Props> = (props) => (
  <h6 className="text-lg font-bold mb-4 last:mb-0 text-pretty" {...props} />
);
