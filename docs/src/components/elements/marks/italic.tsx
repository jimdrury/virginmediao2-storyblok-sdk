import type { ComponentProps, FC } from 'react';

type ItalicProps = Omit<ComponentProps<'em'>, 'className'>;

export const Italic: FC<ItalicProps> = (props) => (
  <em className="italic" {...props} />
);
