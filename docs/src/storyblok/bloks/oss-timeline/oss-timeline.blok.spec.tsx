import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OssTimeline, type OssTimelineBlok } from './oss-timeline.blok';

// Mock storyblokEditable
vi.mock('@/storyblok/engine', () => ({
  storyblokEditable: (blok: { _uid: string }) => ({
    'data-blok-c': blok._uid,
    'data-blok-uid': blok._uid,
  }),
}));

describe('OssTimeline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockBlok: OssTimelineBlok = {
    _uid: 'timeline-uid',
    component: 'oss-timeline',
    snap_icon: true,
    content: [
      {
        _uid: 'item-1',
        component: 'oss-timeline-item',
        title: 'Item 1',
        line_color: 'primary',
      },
      {
        _uid: 'item-2',
        component: 'oss-timeline-item',
        title: 'Item 2',
        line_color: 'secondary',
      },
    ],
  };

  const MockStoryblokComponent = vi.fn(
    ({ blok, timelineFirst, timelineLast, timelinePrevColor }) => (
      <li
        data-testid={`timeline-item-${blok._uid}`}
        data-first={timelineFirst}
        data-last={timelineLast}
        data-prev-color={timelinePrevColor}
      >
        {blok.title}
      </li>
    ),
  );

  it('renders timeline with correct classes', () => {
    const { container } = render(
      <OssTimeline
        blok={mockBlok}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const timeline = container.querySelector('ul');
    expect(timeline).toHaveClass(
      'timeline',
      'timeline-vertical',
      'timeline-compact',
      'timeline-snap-icon',
    );
  });

  it('renders without snap_icon class when false', () => {
    const blokWithoutSnap = { ...mockBlok, snap_icon: false };

    const { container } = render(
      <OssTimeline
        blok={blokWithoutSnap}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const timeline = container.querySelector('ul');
    expect(timeline).toHaveClass(
      'timeline',
      'timeline-vertical',
      'timeline-compact',
    );
    expect(timeline).not.toHaveClass('timeline-snap-icon');
  });

  it('renders all timeline items', () => {
    render(
      <OssTimeline
        blok={mockBlok}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    expect(screen.getByTestId('timeline-item-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-item-item-2')).toBeInTheDocument();
  });

  it('passes correct props to timeline items', () => {
    render(
      <OssTimeline
        blok={mockBlok}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const firstItem = screen.getByTestId('timeline-item-item-1');
    const secondItem = screen.getByTestId('timeline-item-item-2');

    expect(firstItem).toHaveAttribute('data-first', 'true');
    expect(firstItem).toHaveAttribute('data-last', 'false');
    expect(firstItem).toHaveAttribute('data-prev-color', 'default');

    expect(secondItem).toHaveAttribute('data-first', 'false');
    expect(secondItem).toHaveAttribute('data-last', 'true');
    expect(secondItem).toHaveAttribute('data-prev-color', 'primary');
  });

  it('applies storyblok editable attributes', () => {
    const { container } = render(
      <OssTimeline
        blok={mockBlok}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const timeline = container.querySelector('ul');
    expect(timeline).toHaveAttribute('data-blok-c', 'timeline-uid');
    expect(timeline).toHaveAttribute('data-blok-uid', 'timeline-uid');
  });

  it('handles empty content array', () => {
    const emptyBlok: OssTimelineBlok = {
      _uid: 'timeline-uid',
      component: 'oss-timeline',
      snap_icon: false,
      content: [],
    };

    const { container } = render(
      <OssTimeline
        blok={emptyBlok}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const timeline = container.querySelector('ul');
    expect(timeline).toBeEmptyDOMElement();
  });
});
