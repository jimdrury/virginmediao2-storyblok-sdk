'use client';

import { createContext, type ReactNode, useContext, useState } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProviderProps {
  children: ReactNode;
  defaultActiveTab?: string;
}

export function TabsProvider({
  children,
  defaultActiveTab,
}: TabsProviderProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || '');

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

export function useTabs() {
  const context = useContext(TabsContext);
  if (context === undefined) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
}
