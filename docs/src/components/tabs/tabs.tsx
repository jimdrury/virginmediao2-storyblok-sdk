'use client';

import clsx from 'clsx';
import { type FC, type ReactNode, useId } from 'react';
import { RovingTabIndexProvider } from 'react-roving-tabindex';

interface TabsProps {
  children: ReactNode;
  className?: string;
  variant?: 'lift' | 'border' | 'box';
  label: string;
}

export const Tabs: FC<TabsProps> = ({
  children,
  className = '',
  variant = 'lift',
  label,
}) => {
  const labelId = useId();
  return (
    <div className="relative">
      <RovingTabIndexProvider
        options={{
          direction: 'horizontal',
        }}
      >
        <span id={labelId} className="sr-only">
          {label}
        </span>
        <div
          role="tablist"
          aria-labelledby={labelId}
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
      </RovingTabIndexProvider>
    </div>
  );
};
