import { render, screen } from '@testing-library/react';
import type { StoryblokRichtext } from 'storyblok-rich-text-react-renderer';
import { describe, expect, it, vi } from 'vitest';
import { OSS_BLOK } from '@/storyblok/bloks';
import { OssCallout, type OssCalloutBlok } from './oss-callout.blok';

// Mock storyblokEditable
vi.mock('@/storyblok/engine', async () => {
  const actual = await vi.importActual('@/storyblok/engine');
  return {
    ...actual,
    storyblokEditable: (blok: { _uid: string }) => ({
      'data-blok-c': blok._uid,
      'data-blok-uid': blok._uid,
    }),
  };
});

const mockRichText: StoryblokRichtext = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is callout content',
        },
      ],
    },
  ],
};

describe('OssCallout', () => {
  it('should render with title and content', () => {
    const blok: OssCalloutBlok = {
      _uid: 'test-uid',
      component: OSS_BLOK.CALLOUT,
      title: 'Important Notice',
      content: mockRichText,
    };

    render(<OssCallout blok={blok} />);

    expect(screen.getByText('Important Notice')).toBeInTheDocument();
    expect(screen.getByText('This is callout content')).toBeInTheDocument();
  });

  it('should render with info variant by default', () => {
    const blok: OssCalloutBlok = {
      _uid: 'test-uid',
      component: OSS_BLOK.CALLOUT,
      title: 'Info',
      content: mockRichText,
    };

    const { container } = render(<OssCallout blok={blok} />);
    const alert = container.querySelector('.alert');
    expect(alert).toHaveClass('alert-info');
  });

  it('should render with success variant', () => {
    const blok: OssCalloutBlok = {
      _uid: 'test-uid',
      component: OSS_BLOK.CALLOUT,
      title: 'Success',
      content: mockRichText,
      variant: 'success',
    };

    const { container } = render(<OssCallout blok={blok} />);
    const alert = container.querySelector('.alert');
    expect(alert).toHaveClass('alert-success');
  });

  it('should render with warning variant', () => {
    const blok: OssCalloutBlok = {
      _uid: 'test-uid',
      component: OSS_BLOK.CALLOUT,
      title: 'Warning',
      content: mockRichText,
      variant: 'warning',
    };

    const { container } = render(<OssCallout blok={blok} />);
    const alert = container.querySelector('.alert');
    expect(alert).toHaveClass('alert-warning');
  });

  it('should render with error variant', () => {
    const blok: OssCalloutBlok = {
      _uid: 'test-uid',
      component: OSS_BLOK.CALLOUT,
      title: 'Error',
      content: mockRichText,
      variant: 'error',
    };

    const { container } = render(<OssCallout blok={blok} />);
    const alert = container.querySelector('.alert');
    expect(alert).toHaveClass('alert-error');
  });

  it('should render with soft variant', () => {
    const blok: OssCalloutBlok = {
      _uid: 'test-uid',
      component: OSS_BLOK.CALLOUT,
      title: 'Soft Alert',
      content: mockRichText,
      variant: 'info',
      decoration: 'soft',
    };

    const { container } = render(<OssCallout blok={blok} />);
    const alert = container.querySelector('.alert');
    expect(alert).toHaveClass('alert-soft');
  });

  it('should render with outline border', () => {
    const blok: OssCalloutBlok = {
      _uid: 'test-uid',
      component: OSS_BLOK.CALLOUT,
      title: 'Outline',
      content: mockRichText,
      decoration: 'outline',
    };

    const { container } = render(<OssCallout blok={blok} />);
    const alert = container.querySelector('.alert');
    expect(alert).toHaveClass('alert-outline');
  });

  it('should render with dashed border', () => {
    const blok: OssCalloutBlok = {
      _uid: 'test-uid',
      component: OSS_BLOK.CALLOUT,
      title: 'Dashed',
      content: mockRichText,
      decoration: 'dash',
    };

    const { container } = render(<OssCallout blok={blok} />);
    const alert = container.querySelector('.alert');
    expect(alert).toHaveClass('alert-dash');
  });

  it('should have storyblok editable attributes', () => {
    const blok: OssCalloutBlok = {
      _uid: 'test-uid',
      component: OSS_BLOK.CALLOUT,
      title: 'Editable',
      content: mockRichText,
    };

    const { container } = render(<OssCallout blok={blok} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('data-blok-c');
    expect(wrapper).toHaveAttribute('data-blok-uid');
  });
});
