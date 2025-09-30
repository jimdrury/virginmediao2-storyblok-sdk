import type { ComponentProps, FC } from 'react';

type TableHeaderProps = Omit<ComponentProps<'th'>, 'className'> & {
  colspan?: number;
  rowspan?: number;
  backgroundColor?: string;
  colwidth?: number;
};

export const TableHeader: FC<TableHeaderProps> = ({
  colspan,
  rowspan,
  backgroundColor,
  colwidth,
  style,
  ...props
}) => (
  <th
    className="border border-gray-300 px-2 py-1 font-semibold bg-gray-100"
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
