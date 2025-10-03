import type { ComponentProps, FC } from 'react';

type H5Props = Omit<ComponentProps<'h5'>, 'className'>;

export const H5: FC<H5Props> = (props) => (
  <h5
    className="text-lg md:text-xl font-bold mb-4 last:mb-0 text-pretty"
    {...props}
  />
);
