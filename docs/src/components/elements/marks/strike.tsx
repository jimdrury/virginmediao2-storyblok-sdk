import type { ComponentProps, FC } from 'react';

type StrikeProps = Omit<ComponentProps<'del'>, 'className'>;

export const Strike: FC<StrikeProps> = (props) => (
  <del className="line-through" {...props} />
);
