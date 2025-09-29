'use client';

import type { MouseEvent, ReactNode } from 'react';
import { useTabs } from './tabs-context';

interface TabProps {
  children: ReactNode;
  tabId: string;
  className?: string;
  onClick?: () => void;
}

export function Tab({ children, tabId, className = '', onClick }: TabProps) {
  const { activeTab, setActiveTab } = useTabs();

  const isActive = activeTab === tabId;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setActiveTab(tabId);
    onClick?.();
  };

  return (
    <button
      type="button"
      role="tab"
      className={`tab ${isActive ? 'tab-active' : ''} ${className}`.trim()}
      onClick={handleClick}
      aria-selected={isActive}
    >
      {children}
    </button>
  );
}
