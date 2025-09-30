import type { ComponentProps, FC } from 'react';

type CodeblockProps = Omit<ComponentProps<'pre'>, 'className'> & {
  class?: string;
};

export const Codeblock: FC<CodeblockProps> = ({
  class: className,
  children,
  ...props
}) => (
  <pre
    className={`bg-gray-100 p-4 rounded mb-4 last:mb-0 text-pretty ${className || ''}`}
    {...props}
  >
    <code>{children}</code>
  </pre>
);
