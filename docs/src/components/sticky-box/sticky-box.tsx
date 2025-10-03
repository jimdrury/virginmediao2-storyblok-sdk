'use client';
import clsx from 'clsx';
import { type FC, type ReactNode, useEffect, useState } from 'react';
import { useMeasure, useWindowSize } from 'react-use';

interface StickyBoxProps {
  children?: ReactNode;
  className?: string;
}

export const StickyBox: FC<StickyBoxProps> = ({ children, className }) => {
  'use client';

  const [enableSticky, setEnableSticky] = useState(false);

  const winSize = useWindowSize();
  const [ref, boxSize] = useMeasure<HTMLDivElement>();

  useEffect(() => {
    setEnableSticky(winSize.height > boxSize.height);
  }, [winSize, boxSize]);

  return (
    <div
      className={clsx(
        {
          sticky: enableSticky,
          'top-8': enableSticky,
        },
        className,
      )}
      ref={ref}
    >
      {children}
    </div>
  );
};
