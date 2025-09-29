import type { ComponentProps, FC } from 'react';

type OlProps = Omit<ComponentProps<'ol'>, 'className'>;

export const Ol: FC<OlProps> = (props) => (
  <ol
    className="list-decimal list-inside mb-4 last:mb-0 text-pretty"
    {...props}
  />
);
