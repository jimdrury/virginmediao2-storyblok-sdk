import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OSS_BLOK } from '@/storyblok/bloks';
import type { OssTimelineItemBlok } from './oss-timeline-item.blok';
import { OssTimelineItem } from './oss-timeline-item.blok';

const mockStoryblokComponent = vi.fn(({ blok }) => (
  <div data-testid={`blok-${blok._uid}`}>{blok.component}</div>
));

const createMockBlok = (
  overrides?: Partial<OssTimelineItemBlok>,
): OssTimelineItemBlok => ({
  _uid: 'timeline-item-1',
  component: OSS_BLOK.TIMELINE_ITEM,
  title: 'Timeline item',
  content: [],
  line_color: 'neutral',
  ...overrides,
});

describe('OssTimelineItem', () => {
  it('renders timeline item with content', () => {
    const blok = createMockBlok({
      content: [{ _uid: 'content-1', component: 'test-component' }] as Array<{
        _uid: string;
        component: string;
      }>,
    });
    render(
      <OssTimelineItem
        blok={blok}
        context={{
          timelineFirst: false,
          timelineLast: false,
          timelinePrevColor: 'neutral',
        }}
        StoryblokComponent={mockStoryblokComponent}
      />,
    );
    expect(screen.getByTestId('blok-content-1')).toBeInTheDocument();
  });

  it('renders hr with previous color when not first', () => {
    const blok = createMockBlok();
    const { container } = render(
      <OssTimelineItem
        blok={blok}
        context={{
          timelineFirst: false,
          timelineLast: false,
          timelinePrevColor: 'primary',
        }}
        StoryblokComponent={mockStoryblokComponent}
      />,
    );
    const hrs = container.querySelectorAll('hr');
    expect(hrs.length).toBeGreaterThan(0);
  });

  it('does not render top hr when first item', () => {
    const blok = createMockBlok();
    const { container } = render(
      <OssTimelineItem
        blok={blok}
        context={{
          timelineFirst: true,
          timelineLast: false,
          timelinePrevColor: 'primary',
        }}
        StoryblokComponent={mockStoryblokComponent}
      />,
    );
    const hrs = container.querySelectorAll('hr');
    // Should only have bottom hr
    expect(hrs.length).toBe(1);
  });

  it('does not render bottom hr when last item', () => {
    const blok = createMockBlok();
    const { container } = render(
      <OssTimelineItem
        blok={blok}
        context={{
          timelineFirst: false,
          timelineLast: true,
          timelinePrevColor: 'primary',
        }}
        StoryblokComponent={mockStoryblokComponent}
      />,
    );
    const hrs = container.querySelectorAll('hr');
    // Should only have top hr
    expect(hrs.length).toBe(1);
  });

  it('renders icon in timeline-middle', () => {
    const blok = createMockBlok();
    const { container } = render(
      <OssTimelineItem
        blok={blok}
        context={{
          timelineFirst: false,
          timelineLast: false,
          timelinePrevColor: 'neutral',
        }}
        StoryblokComponent={mockStoryblokComponent}
      />,
    );
    const timelineMiddle = container.querySelector('.timeline-middle');
    expect(timelineMiddle).toBeInTheDocument();
    expect(timelineMiddle?.querySelector('svg')).toBeInTheDocument();
  });

  it('applies correct classes to timeline box', () => {
    const blok = createMockBlok();
    const { container } = render(
      <OssTimelineItem
        blok={blok}
        context={{
          timelineFirst: false,
          timelineLast: false,
          timelinePrevColor: 'neutral',
        }}
        StoryblokComponent={mockStoryblokComponent}
      />,
    );
    const timelineBox = container.querySelector('.timeline-box');
    expect(timelineBox).toHaveClass(
      'timeline-end',
      'timeline-box',
      'flex',
      'flex-col',
      'gap-4',
    );
  });

  it('applies mb-0 class when last item', () => {
    const blok = createMockBlok();
    const { container } = render(
      <OssTimelineItem
        blok={blok}
        context={{
          timelineFirst: false,
          timelineLast: true,
          timelinePrevColor: 'primary',
        }}
        StoryblokComponent={mockStoryblokComponent}
      />,
    );
    const timelineBox = container.querySelector('.timeline-box');
    expect(timelineBox).toHaveClass('mb-0');
  });

  it('renders multiple content items', () => {
    const blok = createMockBlok({
      content: [
        { _uid: 'content-1', component: 'test-1' },
        { _uid: 'content-2', component: 'test-2' },
        { _uid: 'content-3', component: 'test-3' },
      ] as Array<{ _uid: string; component: string }>,
    });
    render(
      <OssTimelineItem
        blok={blok}
        context={{
          timelineFirst: false,
          timelineLast: false,
          timelinePrevColor: 'neutral',
        }}
        StoryblokComponent={mockStoryblokComponent}
      />,
    );
    expect(screen.getByTestId('blok-content-1')).toBeInTheDocument();
    expect(screen.getByTestId('blok-content-2')).toBeInTheDocument();
    expect(screen.getByTestId('blok-content-3')).toBeInTheDocument();
  });
});
