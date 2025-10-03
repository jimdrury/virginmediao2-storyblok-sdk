import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OssTabs, type OssTabsBlok } from './oss-tabs.blok';

// Mock components
vi.mock('@/components/tabs', () => ({
  Tab: ({ children, tabId }: { children: React.ReactNode; tabId: string }) => (
    <div data-testid={`tab-${tabId}`}>{children}</div>
  ),
  Tabs: ({
    children,
    label,
    variant,
  }: {
    children: React.ReactNode;
    label: string;
    variant: string;
  }) => (
    <div data-testid="tabs" data-label={label} data-variant={variant}>
      {children}
    </div>
  ),
  TabsProvider: ({
    children,
    defaultActiveTab,
  }: {
    children: React.ReactNode;
    defaultActiveTab: string;
  }) => (
    <div data-testid="tabs-provider" data-default-active={defaultActiveTab}>
      {children}
    </div>
  ),
}));

// Mock storyblokEditable
vi.mock('@/storyblok/engine', () => ({
  storyblokEditable: (blok: { _uid: string }) => ({
    'data-blok-c': blok._uid,
    'data-blok-uid': blok._uid,
  }),
}));

describe('OssTabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockBlok: OssTabsBlok = {
    _uid: 'tabs-uid',
    component: 'oss-tabs',
    label: 'Test Tabs',
    variant: 'border',
    tabs: [
      {
        _uid: 'tab-1',
        component: 'oss-tab',
        title: 'Tab 1',
        content: [],
      },
      {
        _uid: 'tab-2',
        component: 'oss-tab',
        title: 'Tab 2',
        content: [],
      },
    ],
  };

  const MockStoryblokComponent = vi.fn(({ blok }) => (
    <div data-testid={`blok-${blok._uid}`}>{blok.title}</div>
  ));

  it('renders tabs with correct props', () => {
    render(
      <OssTabs blok={mockBlok} StoryblokComponent={MockStoryblokComponent} />,
    );

    expect(screen.getByTestId('tabs')).toHaveAttribute(
      'data-label',
      'Test Tabs',
    );
    expect(screen.getByTestId('tabs')).toHaveAttribute(
      'data-variant',
      'border',
    );
  });

  it('renders all tab buttons', () => {
    render(
      <OssTabs blok={mockBlok} StoryblokComponent={MockStoryblokComponent} />,
    );

    expect(screen.getByTestId('tab-tab-1')).toHaveTextContent('Tab 1');
    expect(screen.getByTestId('tab-tab-2')).toHaveTextContent('Tab 2');
  });

  it('renders all tab content', () => {
    render(
      <OssTabs blok={mockBlok} StoryblokComponent={MockStoryblokComponent} />,
    );

    expect(screen.getByTestId('blok-tab-1')).toBeInTheDocument();
    expect(screen.getByTestId('blok-tab-2')).toBeInTheDocument();
  });

  it('uses first tab as default active', () => {
    render(
      <OssTabs blok={mockBlok} StoryblokComponent={MockStoryblokComponent} />,
    );

    expect(screen.getByTestId('tabs-provider')).toHaveAttribute(
      'data-default-active',
      'tab-1',
    );
  });

  it('applies storyblok editable attributes', () => {
    const { container } = render(
      <OssTabs blok={mockBlok} StoryblokComponent={MockStoryblokComponent} />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('data-blok-c', 'tabs-uid');
    expect(wrapper).toHaveAttribute('data-blok-uid', 'tabs-uid');
  });

  it('uses default variant when not provided', () => {
    const blokWithoutVariant = { ...mockBlok, variant: undefined };

    render(
      <OssTabs
        blok={blokWithoutVariant}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    expect(screen.getByTestId('tabs')).toHaveAttribute(
      'data-variant',
      'border',
    );
  });
});
