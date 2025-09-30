import type { ComponentProps, FC } from 'react';

type TableCellProps = Omit<ComponentProps<'td'>, 'className'> & {
  colspan?: number;
  rowspan?: number;
  backgroundColor?: string;
  colwidth?: number;
};

export const TableCell: FC<TableCellProps> = ({
  colspan,
  rowspan,
  backgroundColor,
  colwidth,
  style,
  ...props
}) => (
  <td
    className="border border-gray-300 px-2 py-1"
    colSpan={colspan}
    rowSpan={rowspan}
    style={{
      backgroundColor,
      width: colwidth ? `${colwidth}px` : undefined,
      ...style,
    }}
    {...props}
  />
);
