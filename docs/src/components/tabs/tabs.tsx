'use client';

import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

interface TabsProps {
  children: ReactNode;
  className?: string;
  variant?: 'lift' | 'border' | 'box';
}

export const Tabs: FC<TabsProps> = ({
  children,
  className = '',
  variant = 'lift',
}) => (
  <div
    role="tablist"
    className={clsx({
      tabs: true,
      'tabs-border': variant === 'border',
      'tabs-box': variant === 'box',
      'tabs-lift': variant === 'lift',
      'tabs-md': true,
      [className]: className,
    })}
  >
    {children}
  </div>
);
