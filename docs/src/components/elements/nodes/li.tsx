import type { ComponentProps, FC } from 'react';

type LiProps = Omit<ComponentProps<'li'>, 'className'>;

export const Li: FC<LiProps> = (props) => (
  <li className="mb-1 text-pretty" {...props} />
);
