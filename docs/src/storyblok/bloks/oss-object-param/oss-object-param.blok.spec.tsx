import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OSS_BLOK } from '@/storyblok/bloks';
import {
  OssObjectParamOption,
  type OssObjectParamOptionBlok,
} from './oss-object-param.blok';

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

  it('should render title and type', () => {
    const mockBlok: OssObjectParamOptionBlok = {
      _uid: 'param-uid',
      component: OSS_BLOK.OBJECT_PARAM,
      title: 'apiKey',
      type: 'string',
      callout: [] as [BlokType],
      description: [],
      options: [],
    };

    render(
      <OssObjectParamOption
        blok={mockBlok}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    expect(screen.getByText('apiKey')).toBeInTheDocument();
    expect(screen.getByText('string')).toBeInTheDocument();
  });

  it('should render description bloks when provided', () => {
    const mockBlok: OssObjectParamOptionBlok = {
      _uid: 'param-uid',
      component: OSS_BLOK.OBJECT_PARAM,
      title: 'config',
      type: 'object',
      callout: [] as [BlokType],
      description: [
        { _uid: 'desc-1', component: OSS_BLOK.TEXT },
        { _uid: 'desc-2', component: OSS_BLOK.TEXT },
      ],
      options: [],
    };

    render(
      <OssObjectParamOption
        blok={mockBlok}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    expect(screen.getByTestId('blok-desc-1')).toBeInTheDocument();
    expect(screen.getByTestId('blok-desc-2')).toBeInTheDocument();
  });

  it('should not render description section when empty', () => {
    const mockBlok: OssObjectParamOptionBlok = {
      _uid: 'param-uid',
      component: OSS_BLOK.OBJECT_PARAM,
      title: 'param',
      type: 'string',
      callout: [] as [BlokType],
      description: [],
      options: [],
    };

    const { container } = render(
      <OssObjectParamOption
        blok={mockBlok}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const descriptionContainer = container.querySelector(
      '.flex.flex-col.gap-y-3',
    );
    expect(descriptionContainer).not.toBeInTheDocument();
  });

  it('should render options in a definition list', () => {
    const mockBlok: OssObjectParamOptionBlok = {
      _uid: 'param-uid',
      component: OSS_BLOK.OBJECT_PARAM,
      title: 'config',
      type: 'object',
      callout: [] as [BlokType],
      description: [],
      options: [
        { _uid: 'option-1', component: OSS_BLOK.OBJECT_PARAM_OPTION },
        { _uid: 'option-2', component: OSS_BLOK.OBJECT_PARAM_OPTION },
      ],
    };

    const { container } = render(
      <OssObjectParamOption
        blok={mockBlok}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const dl = container.querySelector('dl');
    expect(dl).toBeInTheDocument();
    expect(dl).toHaveClass('grid', 'grid-cols-[max-content_1fr]');
    expect(screen.getByTestId('blok-option-1')).toBeInTheDocument();
    expect(screen.getByTestId('blok-option-2')).toBeInTheDocument();
  });

  it('should pass isLast prop correctly to option components', () => {
    const mockBlok: OssObjectParamOptionBlok = {
      _uid: 'param-uid',
      component: OSS_BLOK.OBJECT_PARAM,
      title: 'config',
      type: 'object',
      callout: [] as [BlokType],
      description: [],
      options: [
        { _uid: 'option-1', component: OSS_BLOK.OBJECT_PARAM_OPTION },
        { _uid: 'option-2', component: OSS_BLOK.OBJECT_PARAM_OPTION },
        { _uid: 'option-3', component: OSS_BLOK.OBJECT_PARAM_OPTION },
      ],
    };

    render(
      <OssObjectParamOption
        blok={mockBlok}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    expect(MockStoryblokComponent).toHaveBeenCalledTimes(3);

    const calls = MockStoryblokComponent.mock.calls;
    expect(calls[0][0].isLast).toBe(false);
    expect(calls[1][0].isLast).toBe(false);
    expect(calls[2][0].isLast).toBe(true);
  });

  it('should not render options section when empty', () => {
    const mockBlok: OssObjectParamOptionBlok = {
      _uid: 'param-uid',
      component: OSS_BLOK.OBJECT_PARAM,
      title: 'param',
      type: 'string',
      callout: [] as [BlokType],
      description: [],
      options: [],
    };

    const { container } = render(
      <OssObjectParamOption
        blok={mockBlok}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const dl = container.querySelector('dl');
    expect(dl).not.toBeInTheDocument();
  });

  it('should render callout section when provided', () => {
    const mockBlok: OssObjectParamOptionBlok = {
      _uid: 'param-uid',
      component: OSS_BLOK.OBJECT_PARAM,
      title: 'param',
      type: 'string',
      callout: [{ _uid: 'callout-1', component: OSS_BLOK.CALLOUT }] as [
        BlokType,
      ],
      description: [],
      options: [],
    };

    const { container } = render(
      <OssObjectParamOption
        blok={mockBlok}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const aside = container.querySelector('aside');
    expect(aside).toBeInTheDocument();
    expect(screen.getByTestId('blok-callout-1')).toBeInTheDocument();
  });

  it('should not render callout section when empty', () => {
    const mockBlok: OssObjectParamOptionBlok = {
      _uid: 'param-uid',
      component: OSS_BLOK.OBJECT_PARAM,
      title: 'param',
      type: 'string',
      callout: [] as [BlokType],
      description: [],
      options: [],
    };

    const { container } = render(
      <OssObjectParamOption
        blok={mockBlok}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const aside = container.querySelector('aside');
    expect(aside).not.toBeInTheDocument();
  });

  it('should apply storyblok editable attributes', () => {
    const mockBlok: OssObjectParamOptionBlok = {
      _uid: 'param-uid',
      component: OSS_BLOK.OBJECT_PARAM,
      title: 'param',
      type: 'string',
      callout: [] as [BlokType],
      description: [],
      options: [],
    };

    const { container } = render(
      <OssObjectParamOption
        blok={mockBlok}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('data-blok-c', 'param-uid');
    expect(wrapper).toHaveAttribute('data-blok-uid', 'param-uid');
  });

  it('should apply correct styling classes', () => {
    const mockBlok: OssObjectParamOptionBlok = {
      _uid: 'param-uid',
      component: OSS_BLOK.OBJECT_PARAM,
      title: 'param',
      type: 'string',
      callout: [] as [BlokType],
      description: [],
      options: [],
    };

    const { container } = render(
      <OssObjectParamOption
        blok={mockBlok}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass(
      'border-1',
      'border-base-300',
      'bg-base-200',
      'p-3',
      'py-4',
      'flex',
      'flex-col',
      'gap-3',
      'rounded-xl',
    );
  });
});
