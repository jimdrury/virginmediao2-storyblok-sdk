import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Codeblock } from './codeblock';

describe('Codeblock', () => {
  it('renders pre with code wrapper', () => {
    render(<Codeblock>const test = true;</Codeblock>);
    const preElement = screen.getByText('const test = true;').closest('pre');
    const codeElement = screen.getByText('const test = true;');
    expect(preElement).toBeInTheDocument();
    expect(codeElement.tagName).toBe('CODE');
  });

  it('applies default CSS classes', () => {
    render(<Codeblock>code content</Codeblock>);
    const preElement = screen.getByText('code content').closest('pre');
    expect(preElement).toHaveClass(
      'bg-gray-100',
      'p-4',
      'rounded',
      'mb-4',
      'last:mb-0',
      'text-pretty',
    );
  });

  it('applies custom class prop', () => {
    render(<Codeblock class="custom-code">code</Codeblock>);
    const preElement = screen.getByText('code').closest('pre');
    expect(preElement?.className).toContain('custom-code');
  });

  it('renders children correctly', () => {
    render(
      <Codeblock>
        <span>Multi-line code</span>
      </Codeblock>,
    );
    expect(screen.getByText('Multi-line code')).toBeInTheDocument();
  });

  it('applies additional props', () => {
    render(
      <Codeblock data-testid="code-block" aria-label="Code example">
        test
      </Codeblock>,
    );
    const preElement = screen.getByTestId('code-block');
    expect(preElement).toHaveAttribute('aria-label', 'Code example');
  });
});
