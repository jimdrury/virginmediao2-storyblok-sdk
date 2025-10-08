import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OSS_BLOK } from '@/storyblok/bloks';
import {
  OssObjectParamOption,
  type OssObjectParamOptionBlok,
} from './oss-object-param-option.blok';

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

// Mock StoryblokComponent
const MockStoryblokComponent = vi.fn(({ blok }) => (
  <div data-testid={`blok-${blok._uid}`}>{blok.component}</div>
));

describe('OssObjectParamOption', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render title as code mark', () => {
    const mockBlok: OssObjectParamOptionBlok = {
      _uid: 'option-uid',
      component: OSS_BLOK.OBJECT_PARAM_OPTION,
      title: 'enabled',
      description: [],
    };

    render(
      <OssObjectParamOption
        blok={mockBlok}
        context={{ isLast: false }}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const dt = screen.getByText('enabled').closest('dt');
    expect(dt).toBeInTheDocument();
  });

  it('should render description bloks when provided', () => {
    const mockBlok: OssObjectParamOptionBlok = {
      _uid: 'option-uid',
      component: OSS_BLOK.OBJECT_PARAM_OPTION,
      title: 'enabled',
      description: [
        { _uid: 'desc-1', component: OSS_BLOK.TEXT },
        { _uid: 'desc-2', component: OSS_BLOK.TEXT },
      ],
    };

    render(
      <OssObjectParamOption
        blok={mockBlok}
        context={{ isLast: false }}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    expect(screen.getByTestId('blok-desc-1')).toBeInTheDocument();
    expect(screen.getByTestId('blok-desc-2')).toBeInTheDocument();
  });

  it('should not render dd element when description is empty', () => {
    const mockBlok: OssObjectParamOptionBlok = {
      _uid: 'option-uid',
      component: OSS_BLOK.OBJECT_PARAM_OPTION,
      title: 'enabled',
      description: [],
    };

    const { container } = render(
      <OssObjectParamOption
        blok={mockBlok}
        context={{ isLast: false }}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const dd = container.querySelector('dd');
    expect(dd).not.toBeInTheDocument();
  });

  it('should render hr separator when not last', () => {
    const mockBlok: OssObjectParamOptionBlok = {
      _uid: 'option-uid',
      component: OSS_BLOK.OBJECT_PARAM_OPTION,
      title: 'enabled',
      description: [],
    };

    const { container } = render(
      <OssObjectParamOption
        blok={mockBlok}
        context={{ isLast: false }}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const hr = container.querySelector('hr');
    expect(hr).toBeInTheDocument();
    expect(hr).toHaveClass('border-base-300', 'col-span-2');
  });

  it('should not render hr separator when last', () => {
    const mockBlok: OssObjectParamOptionBlok = {
      _uid: 'option-uid',
      component: OSS_BLOK.OBJECT_PARAM_OPTION,
      title: 'enabled',
      description: [],
    };

    const { container } = render(
      <OssObjectParamOption
        blok={mockBlok}
        context={{ isLast: true }}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const hr = container.querySelector('hr');
    expect(hr).not.toBeInTheDocument();
  });

  it('should apply storyblok editable attributes to dt', () => {
    const mockBlok: OssObjectParamOptionBlok = {
      _uid: 'option-uid',
      component: OSS_BLOK.OBJECT_PARAM_OPTION,
      title: 'enabled',
      description: [],
    };

    const { container } = render(
      <OssObjectParamOption
        blok={mockBlok}
        context={{ isLast: false }}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const dt = container.querySelector('dt');
    expect(dt).toHaveAttribute('data-blok-c', 'option-uid');
    expect(dt).toHaveAttribute('data-blok-uid', 'option-uid');
  });

  it('should apply storyblok editable attributes to dd when description exists', () => {
    const mockBlok: OssObjectParamOptionBlok = {
      _uid: 'option-uid',
      component: OSS_BLOK.OBJECT_PARAM_OPTION,
      title: 'enabled',
      description: [{ _uid: 'desc-1', component: OSS_BLOK.TEXT }],
    };

    const { container } = render(
      <OssObjectParamOption
        blok={mockBlok}
        context={{ isLast: false }}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const dd = container.querySelector('dd');
    expect(dd).toHaveAttribute('data-blok-c', 'option-uid');
    expect(dd).toHaveAttribute('data-blok-uid', 'option-uid');
  });

  it('should apply correct styling classes to dt', () => {
    const mockBlok: OssObjectParamOptionBlok = {
      _uid: 'option-uid',
      component: OSS_BLOK.OBJECT_PARAM_OPTION,
      title: 'enabled',
      description: [],
    };

    const { container } = render(
      <OssObjectParamOption
        blok={mockBlok}
        context={{ isLast: false }}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const dt = container.querySelector('dt');
    expect(dt).toHaveClass(
      'pr-3',
      'border-r-1',
      'border-base-300',
      'min-w-[100px]',
    );
  });

  it('should handle isLast context undefined gracefully', () => {
    const mockBlok: OssObjectParamOptionBlok = {
      _uid: 'option-uid',
      component: OSS_BLOK.OBJECT_PARAM_OPTION,
      title: 'enabled',
      description: [],
    };

    const { container } = render(
      <OssObjectParamOption
        blok={mockBlok}
        context={{}}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    // Should render hr when isLast is undefined (falsy)
    const hr = container.querySelector('hr');
    expect(hr).toBeInTheDocument();
  });
});
