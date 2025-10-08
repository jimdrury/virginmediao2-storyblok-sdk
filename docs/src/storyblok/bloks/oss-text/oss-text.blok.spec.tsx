import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OSS_BLOK } from '@/storyblok/bloks';
import { OssText, type OssTextBlok } from './oss-text.blok';

// Mock the RichText component
vi.mock('@/components/rich-text', () => ({
  RichText: ({ content }: { content: unknown }) => (
    <div data-testid="rich-text">{JSON.stringify(content)}</div>
  ),
}));

// Mock storyblokEditable
vi.mock('@/storyblok/engine', () => ({
  storyblokEditable: (blok: { _uid: string }) => ({
    'data-blok-c': blok._uid,
    'data-blok-uid': blok._uid,
  }),
}));

describe('OssText', () => {
  const mockBlok: OssTextBlok = {
    _uid: 'test-uid',
    component: OSS_BLOK.TEXT,
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Test content' }],
        },
      ],
    },
  };

  it('renders with content', () => {
    render(
      <OssText
        blok={mockBlok}
        context={{} as never}
        StoryblokComponent={vi.fn()}
      />,
    );

    expect(screen.getByTestId('rich-text')).toBeInTheDocument();
  });

  it('applies storyblok editable attributes', () => {
    const { container } = render(
      <OssText
        blok={mockBlok}
        context={{} as never}
        StoryblokComponent={vi.fn()}
      />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('data-blok-c', 'test-uid');
    expect(wrapper).toHaveAttribute('data-blok-uid', 'test-uid');
  });

  it('passes content to RichText component', () => {
    render(
      <OssText
        blok={mockBlok}
        context={{} as never}
        StoryblokComponent={vi.fn()}
      />,
    );

    const richText = screen.getByTestId('rich-text');
    expect(richText).toHaveTextContent(JSON.stringify(mockBlok.content));
  });
});
