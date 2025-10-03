import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TabPanel } from './tab-panel';
import { TabsProvider } from './tabs-context';

describe('TabPanel', () => {
  it('renders tab panel with children', () => {
    render(
      <TabsProvider defaultActiveTab="tab-1">
        <TabPanel tabId="tab-1">Panel content</TabPanel>
      </TabsProvider>,
    );

    expect(screen.getByText('Panel content')).toBeInTheDocument();
  });

  it('renders with correct role and attributes', () => {
    render(
      <TabsProvider defaultActiveTab="tab-1">
        <TabPanel tabId="tab-1">Panel content</TabPanel>
      </TabsProvider>,
    );

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('aria-labelledby', 'tab-1');
  });

  it('shows panel when tab is active', () => {
    render(
      <TabsProvider defaultActiveTab="tab-1">
        <TabPanel tabId="tab-1">Active panel</TabPanel>
      </TabsProvider>,
    );

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveClass('tab-panel');
    expect(panel).not.toHaveClass('hidden');
  });

  it('hides panel when tab is inactive', () => {
    render(
      <TabsProvider defaultActiveTab="tab-2">
        <TabPanel tabId="tab-1">Inactive panel</TabPanel>
      </TabsProvider>,
    );

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveClass('tab-panel', 'hidden');
  });

  it('applies custom className', () => {
    render(
      <TabsProvider defaultActiveTab="tab-1">
        <TabPanel tabId="tab-1" className="custom-class">
          Panel content
        </TabPanel>
      </TabsProvider>,
    );

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveClass('custom-class');
  });
});
