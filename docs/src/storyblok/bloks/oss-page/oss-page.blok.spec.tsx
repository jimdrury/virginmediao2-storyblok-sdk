import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OssPage, type OssPageBlok } from './oss-page.blok';

// Mock StoryblokComponent
const MockStoryblokComponent = vi.fn(({ blok }) => (
  <div data-testid={`blok-${blok._uid}`}>{blok.component}</div>
));

describe('OssPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockBlok: OssPageBlok = {
    _uid: 'page-uid',
    component: 'oss-page',
    content: [
      {
        _uid: 'blok-1',
        component: 'oss-text',
      },
      {
        _uid: 'blok-2',
        component: 'oss-tabs',
      },
    ],
  };

  it('renders all content bloks', () => {
    render(
      <OssPage blok={mockBlok} StoryblokComponent={MockStoryblokComponent} />,
    );

    expect(screen.getByTestId('blok-blok-1')).toBeInTheDocument();
    expect(screen.getByTestId('blok-blok-2')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(
      <OssPage blok={mockBlok} StoryblokComponent={MockStoryblokComponent} />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'flex-col', 'gap-4');
  });

  it('passes correct props to StoryblokComponent', () => {
    render(
      <OssPage blok={mockBlok} StoryblokComponent={MockStoryblokComponent} />,
    );

    expect(MockStoryblokComponent).toHaveBeenCalledTimes(2);

    // Check that it was called with the correct blok data
    const calls = MockStoryblokComponent.mock.calls;
    expect(calls[0][0].blok).toEqual(mockBlok.content[0]);
    expect(calls[1][0].blok).toEqual(mockBlok.content[1]);
  });

  it('renders empty content array', () => {
    const emptyBlok: OssPageBlok = {
      _uid: 'page-uid',
      component: 'oss-page',
      content: [],
    };

    const { container } = render(
      <OssPage blok={emptyBlok} StoryblokComponent={MockStoryblokComponent} />,
    );

    expect(container.firstChild).toBeEmptyDOMElement();
  });
});
