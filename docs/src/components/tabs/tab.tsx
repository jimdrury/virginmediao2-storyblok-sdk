'use client';

import clsx from 'clsx';
import {
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  useRef,
} from 'react';
import { useFocusEffect, useRovingTabIndex } from 'react-roving-tabindex';
import { useTabs } from './tabs-context';

interface TabProps {
  children: ReactNode;
  tabId: string;
  className?: string;
}

export function Tab({ children, tabId, className = '' }: TabProps) {
  const { activeTab, setActiveTab } = useTabs();

  const isActive = activeTab === tabId;
  const ref = useRef<HTMLButtonElement>(null);

  // handleKeyDown and handleClick are stable for the lifetime of the component:
  const [tabIndex, focussed, handleKeyDown, handleClick] = useRovingTabIndex(
    ref as RefObject<HTMLElement>,
    false,
  );

  const onClick = () => {
    setActiveTab(tabId);
    handleClick();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    handleKeyDown(e);
  };

  useFocusEffect(focussed, ref as RefObject<HTMLElement>);

  return (
    <button
      id={tabId}
      type="button"
      role="tab"
      className={clsx(
        {
          tab: true,
          'tab-active': isActive,
        },
        className,
      )}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-selected={isActive}
      ref={ref}
    >
      {children}
    </button>
  );
}
