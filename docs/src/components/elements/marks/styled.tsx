import type { ComponentProps, FC } from 'react';

type StyledProps = Omit<ComponentProps<'span'>, 'className'> & {
  class?: string;
};

export const Styled: FC<StyledProps> = ({ class: className, ...props }) => (
  <span className={className} {...props} />
);
