import type { ComponentProps, FC } from 'react';

type TableRowProps = Omit<ComponentProps<'tr'>, 'className'>;

export const TableRow: FC<TableRowProps> = (props) => (
  <tr className="border-b border-gray-300" {...props} />
);
