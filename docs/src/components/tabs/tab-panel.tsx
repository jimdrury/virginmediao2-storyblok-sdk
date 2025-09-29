'use client';

import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { useTabs } from './tabs-context';

interface TabPanelProps {
  children: ReactNode;
  tabId: string;
  className?: string;
}

export const TabPanel: FC<TabPanelProps> = ({ children, tabId, className }) => {
  const { activeTab } = useTabs();

  return (
    <div
      role="tabpanel"
      aria-labelledby={tabId}
      className={clsx(
        {
          'tab-panel': true,
          hidden: activeTab !== tabId,
        },
        className,
      )}
    >
      {children}
    </div>
  );
};
