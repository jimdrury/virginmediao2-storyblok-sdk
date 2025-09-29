import type { ComponentProps, FC } from 'react';

type SubscriptProps = Omit<ComponentProps<'sub'>, 'className'>;

export const Subscript: FC<SubscriptProps> = (props) => (
  <sub className="text-sm" {...props} />
);
