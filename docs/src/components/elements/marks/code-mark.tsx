import type { ComponentProps, FC } from 'react';

type CodeMarkProps = Omit<ComponentProps<'code'>, 'className'>;

export const CodeMark: FC<CodeMarkProps> = (props) => (
  <code
    className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
    {...props}
  />
);
