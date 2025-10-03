import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CodeSnippet, LANGUAGE } from './index';

describe('CodeSnippet', () => {
  it('renders message when no code is provided', () => {
    render(<CodeSnippet />);
    expect(
      screen.getByText('Please add code to create a snippet'),
    ).toBeInTheDocument();
  });

  it('renders code snippet with default language', () => {
    const code = 'const test = true;';
    render(<CodeSnippet code={code} />);
    expect(screen.getByText(code)).toBeInTheDocument();
  });

  it('renders code snippet with title', () => {
    const code = 'function hello() {}';
    const title = 'test.js';
    const { container } = render(
      <CodeSnippet code={code} title={title} language={LANGUAGE.JS} />,
    );
    expect(screen.getByText(title)).toBeInTheDocument();
    // Code is syntax highlighted so we check the container has the code
    expect(container.textContent).toContain('function');
    expect(container.textContent).toContain('hello');
  });

  it('trims whitespace from code', () => {
    const code = '  \n  const test = true;  \n  ';
    const { container } = render(<CodeSnippet code={code} />);
    expect(container.textContent).toContain('const test = true;');
  });

  it('renders with TypeScript language', () => {
    const code = 'const x: number = 5;';
    const { container } = render(
      <CodeSnippet code={code} language={LANGUAGE.TYPESCRIPT} />,
    );
    expect(container.textContent).toContain('const');
    expect(container.textContent).toContain('number');
  });

  it('renders with CSS language', () => {
    const code = '.class { color: red; }';
    const { container } = render(
      <CodeSnippet code={code} language={LANGUAGE.CSS} />,
    );
    expect(container.textContent).toContain('.class');
    expect(container.textContent).toContain('color');
  });

  it('renders with HTML language', () => {
    const code = '<div>Test</div>';
    const { container } = render(
      <CodeSnippet code={code} language={LANGUAGE.HTML} />,
    );
    expect(container.textContent).toContain('div');
    expect(container.textContent).toContain('Test');
  });

  it('renders with JSON language', () => {
    const code = '{"key": "value"}';
    const { container } = render(
      <CodeSnippet code={code} language={LANGUAGE.JSON} />,
    );
    expect(container.textContent).toContain('key');
    expect(container.textContent).toContain('value');
  });

  it('renders copy to clipboard button', () => {
    const code = 'const test = true;';
    const { container } = render(<CodeSnippet code={code} />);
    const copyButton = container.querySelector('.mockup-code-action');
    expect(copyButton).toBeInTheDocument();
  });
});
