import type { ComponentProps, FC } from 'react';

type TextStyleProps = Omit<ComponentProps<'span'>, 'className'> & {
  color?: string;
};

export const TextStyle: FC<TextStyleProps> = ({ color, style, ...props }) => (
  <span
    style={{
      color,
      ...style,
    }}
    {...props}
  />
);
