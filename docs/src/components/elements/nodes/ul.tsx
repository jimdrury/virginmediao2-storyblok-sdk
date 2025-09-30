import type { ComponentProps, FC } from 'react';

type UlProps = Omit<ComponentProps<'ul'>, 'className'>;

export const Ul: FC<UlProps> = (props) => (
  <ul className="list-disc list-inside mb-4 last:mb-0 text-pretty" {...props} />
);
