import type { ComponentProps, FC } from 'react';

type AnchorProps = Omit<ComponentProps<'span'>, 'className'> & {
  id?: string;
};

export const Anchor: FC<AnchorProps> = ({ id, ...props }) => (
  <span id={id} {...props} />
);
