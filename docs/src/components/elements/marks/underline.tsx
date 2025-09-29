import type { ComponentProps, FC } from 'react';

type UnderlineProps = Omit<ComponentProps<'u'>, 'className'>;

export const Underline: FC<UnderlineProps> = (props) => (
  <u className="underline" {...props} />
);
