import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tab } from './tab';
import { TabsProvider } from './tabs-context';

// Store the mock functions so we can access them in tests
let mockHandleKeyDown = vi.fn();
let mockHandleClick = vi.fn();

// Mock react-roving-tabindex
vi.mock('react-roving-tabindex', () => ({
  useRovingTabIndex: () => [0, false, mockHandleKeyDown, mockHandleClick],
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

  it('calls handleClick when clicked', async () => {
    mockHandleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <TabsProvider defaultActiveTab="tab-2">
        <Tab tabId="tab-1">Tab 1</Tab>
      </TabsProvider>,
    );

    const tab = screen.getByRole('tab');
    await user.click(tab);

    expect(mockHandleClick).toHaveBeenCalled();
  });

  it('calls handleKeyDown when key is pressed', async () => {
    mockHandleKeyDown = vi.fn();
    const user = userEvent.setup();

    render(
      <TabsProvider defaultActiveTab="tab-1">
        <Tab tabId="tab-1">Tab 1</Tab>
      </TabsProvider>,
    );

    const tab = screen.getByRole('tab');
    await user.type(tab, '{ArrowRight}');

    expect(mockHandleKeyDown).toHaveBeenCalled();
  });

  it('changes active tab when clicked', async () => {
    mockHandleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <TabsProvider defaultActiveTab="tab-1">
        <Tab tabId="tab-1">Tab 1</Tab>
        <Tab tabId="tab-2">Tab 2</Tab>
      </TabsProvider>,
    );

    const tab2 = screen.getByText('Tab 2');
    expect(tab2).not.toHaveClass('tab-active');

    await user.click(tab2);

    // After click, tab-2 should be active
    expect(tab2).toHaveClass('tab-active');
  });
});
