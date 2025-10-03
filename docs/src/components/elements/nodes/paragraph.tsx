import type { ComponentProps, FC } from 'react';

type ParagraphProps = Omit<ComponentProps<'p'>, 'className'>;

export const Paragraph: FC<ParagraphProps> = (props) => (
  <p className="mb-2 last:mb-0 text-base text-pretty" {...props} />
);
