import type { ComponentProps, FC } from 'react';

type QuoteProps = Omit<ComponentProps<'blockquote'>, 'className'>;

export const Quote: FC<QuoteProps> = (props) => (
  <blockquote
    className="border-l-4 border-gray-300 pl-4 italic mb-4 last:mb-0 text-pretty"
    {...props}
  />
);
