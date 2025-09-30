import type { ComponentProps, FC } from 'react';

type TableProps = Omit<ComponentProps<'table'>, 'className'>;

export const Table: FC<TableProps> = (props) => (
  <table
    className="w-full border-collapse border border-gray-300 mb-4 last:mb-0 text-pretty"
    {...props}
  />
);
