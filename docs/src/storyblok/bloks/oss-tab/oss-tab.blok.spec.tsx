import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OssTab, type OssTabBlok } from './oss-tab.blok';

// Mock TabPanel component
vi.mock('@/components/tabs', () => ({
  TabPanel: ({
    children,
    tabId,
  }: {
    children: React.ReactNode;
    tabId: string;
  }) => (
    <div data-testid="tab-panel" data-tab-id={tabId}>
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

describe('OssTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockBlok: OssTabBlok = {
    _uid: 'tab-uid',
    component: 'oss-tab',
    title: 'Tab Title',
    content: [
      {
        _uid: 'content-1',
        component: 'oss-text',
      },
      {
        _uid: 'content-2',
        component: 'oss-snippet',
      },
    ],
  };

  const MockStoryblokComponent = vi.fn(({ blok }) => (
    <div data-testid={`blok-${blok._uid}`}>{blok.component}</div>
  ));

  it('renders tab panel with correct tabId', () => {
    render(
      <OssTab blok={mockBlok} StoryblokComponent={MockStoryblokComponent} />,
    );

    const tabPanel = screen.getByTestId('tab-panel');
    expect(tabPanel).toHaveAttribute('data-tab-id', 'tab-uid');
  });

  it('renders all content bloks', () => {
    render(
      <OssTab blok={mockBlok} StoryblokComponent={MockStoryblokComponent} />,
    );

    expect(screen.getByTestId('blok-content-1')).toBeInTheDocument();
    expect(screen.getByTestId('blok-content-2')).toBeInTheDocument();
  });

  it('applies storyblok editable attributes', () => {
    const { container } = render(
      <OssTab blok={mockBlok} StoryblokComponent={MockStoryblokComponent} />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('data-blok-c', 'tab-uid');
    expect(wrapper).toHaveAttribute('data-blok-uid', 'tab-uid');
  });

  it('renders empty content array', () => {
    const emptyBlok: OssTabBlok = {
      _uid: 'tab-uid',
      component: 'oss-tab',
      title: 'Tab Title',
      content: [],
    };

    const { container } = render(
      <OssTab blok={emptyBlok} StoryblokComponent={MockStoryblokComponent} />,
    );

    const tabPanel = container.querySelector('[data-testid="tab-panel"]');
    expect(tabPanel).toBeEmptyDOMElement();
  });
});
