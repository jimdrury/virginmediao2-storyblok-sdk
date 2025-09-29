import type { ComponentProps, FC } from 'react';

type HighlightProps = Omit<ComponentProps<'mark'>, 'className'> & {
  color?: string;
};

export const Highlight: FC<HighlightProps> = ({ color, style, ...props }) => (
  <mark
    className="bg-yellow-200"
    style={{
      backgroundColor: color,
      ...style,
    }}
    {...props}
  />
);
