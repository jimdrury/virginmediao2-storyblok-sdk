import type { ComponentProps, FC } from 'react';

type ParagraphProps = Omit<ComponentProps<'p'>, 'className'>;

export const Paragraph: FC<ParagraphProps> = (props) => (
  <p className="mb-4 last:mb-0 text-pretty" {...props} />
);
