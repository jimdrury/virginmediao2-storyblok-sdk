import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Tab } from './tab';
import { TabsProvider } from './tabs-context';

// Mock react-roving-tabindex
vi.mock('react-roving-tabindex', () => ({
  useRovingTabIndex: () => [0, false, vi.fn(), vi.fn()],
  useFocusEffect: vi.fn(),
}));

describe('Tab', () => {
  it('renders tab with children', () => {
    render(
      <TabsProvider defaultActiveTab="tab-1">
        <Tab tabId="tab-1">Tab 1</Tab>
      </TabsProvider>,
    );

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
  });

  it('renders as button with correct role', () => {
    render(
      <TabsProvider defaultActiveTab="tab-1">
        <Tab tabId="tab-1">Tab 1</Tab>
      </TabsProvider>,
    );

    const tab = screen.getByRole('tab');
    expect(tab).toBeInTheDocument();
    expect(tab.tagName).toBe('BUTTON');
  });

  it('applies active class when tab is active', () => {
    render(
      <TabsProvider defaultActiveTab="tab-1">
        <Tab tabId="tab-1">Active Tab</Tab>
      </TabsProvider>,
    );

    const tab = screen.getByRole('tab');
    expect(tab).toHaveClass('tab-active');
  });

  it('does not apply active class when tab is inactive', () => {
    render(
      <TabsProvider defaultActiveTab="tab-2">
        <Tab tabId="tab-1">Inactive Tab</Tab>
      </TabsProvider>,
    );

    const tab = screen.getByRole('tab');
    expect(tab).not.toHaveClass('tab-active');
  });

  it('applies custom className', () => {
    render(
      <TabsProvider defaultActiveTab="tab-1">
        <Tab tabId="tab-1" className="custom-class">
          Tab 1
        </Tab>
      </TabsProvider>,
    );

    const tab = screen.getByRole('tab');
    expect(tab).toHaveClass('custom-class');
  });

  it('has correct accessibility attributes', () => {
    render(
      <TabsProvider defaultActiveTab="tab-1">
        <Tab tabId="tab-1">Tab 1</Tab>
      </TabsProvider>,
    );

    const tab = screen.getByRole('tab');
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveAttribute('tabindex', '0');
  });
});
