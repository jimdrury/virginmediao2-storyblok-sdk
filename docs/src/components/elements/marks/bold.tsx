import type { ComponentProps, FC } from 'react';

type BoldProps = Omit<ComponentProps<'strong'>, 'className'>;

export const Bold: FC<BoldProps> = (props) => (
  <strong className="font-bold" {...props} />
);
