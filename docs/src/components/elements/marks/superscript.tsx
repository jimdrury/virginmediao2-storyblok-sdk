import type { ComponentProps, FC } from 'react';

type SuperscriptProps = Omit<ComponentProps<'sup'>, 'className'>;

export const Superscript: FC<SuperscriptProps> = (props) => (
  <sup className="text-sm" {...props} />
);
