import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OssSnippet, type OssSnippetBlok } from './oss-snippet.blok';

// Mock CodeSnippet component
vi.mock('@/components/code-snippet', () => ({
  CodeSnippet: ({
    code,
    title,
    language,
  }: {
    code: string;
    title?: string;
    language?: string;
  }) => (
    <div
      data-testid="code-snippet"
      data-code={code}
      data-title={title}
      data-language={language}
    >
      {code}
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

describe('OssSnippet', () => {
  const mockBlok: OssSnippetBlok = {
    _uid: 'snippet-uid',
    component: 'oss-snippet',
    code: {
      code: 'console.log("Hello, World!");',
      title: 'Example Code',
      language: 'javascript',
    },
  };

  it('renders code snippet with correct props', () => {
    render(<OssSnippet blok={mockBlok} />);

    const snippet = screen.getByTestId('code-snippet');
    expect(snippet).toHaveAttribute(
      'data-code',
      'console.log("Hello, World!");',
    );
    expect(snippet).toHaveAttribute('data-title', 'Example Code');
    expect(snippet).toHaveAttribute('data-language', 'javascript');
  });

  it('renders without optional props', () => {
    const blokWithoutOptional: OssSnippetBlok = {
      _uid: 'snippet-uid',
      component: 'oss-snippet',
      code: {
        code: 'const x = 1;',
      },
    };

    render(<OssSnippet blok={blokWithoutOptional} />);

    const snippet = screen.getByTestId('code-snippet');
    expect(snippet).toHaveAttribute('data-code', 'const x = 1;');
    expect(snippet).not.toHaveAttribute('data-title');
    expect(snippet).not.toHaveAttribute('data-language');
  });

  it('applies storyblok editable attributes', () => {
    const { container } = render(<OssSnippet blok={mockBlok} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('data-blok-c', 'snippet-uid');
    expect(wrapper).toHaveAttribute('data-blok-uid', 'snippet-uid');
  });
});
