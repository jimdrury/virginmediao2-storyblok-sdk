import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { TabsProvider, useTabs } from './tabs-context';

describe('TabsContext', () => {
  it('provides default active tab', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <TabsProvider defaultActiveTab="tab-1">{children}</TabsProvider>
    );

    const { result } = renderHook(() => useTabs(), { wrapper });

    expect(result.current.activeTab).toBe('tab-1');
  });

  it('allows changing active tab', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <TabsProvider defaultActiveTab="tab-1">{children}</TabsProvider>
    );

    const { result } = renderHook(() => useTabs(), { wrapper });

    expect(result.current.activeTab).toBe('tab-1');

    act(() => {
      result.current.setActiveTab('tab-2');
    });

    expect(result.current.activeTab).toBe('tab-2');
  });

  it('throws error when useTabs is called outside provider', () => {
    // Suppress console.error for this test since we expect an error
    const consoleError = console.error;
    console.error = () => {};

    expect(() => {
      renderHook(() => useTabs());
    }).toThrow('useTabs must be used within a TabsProvider');

    // Restore console.error
    console.error = consoleError;
  });

  it('handles empty string as default active tab', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <TabsProvider defaultActiveTab="">{children}</TabsProvider>
    );

    const { result } = renderHook(() => useTabs(), { wrapper });

    expect(result.current.activeTab).toBe('');
  });
});
