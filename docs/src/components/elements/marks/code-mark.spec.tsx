import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CodeMark } from './code-mark';

describe('CodeMark', () => {
  it('renders code with children', () => {
    render(<CodeMark>Code text</CodeMark>);

    const code = screen.getByText('Code text');
    expect(code).toBeInTheDocument();
    expect(code.tagName).toBe('CODE');
  });

  it('applies correct CSS classes', () => {
    render(<CodeMark>Code text</CodeMark>);

    const code = screen.getByText('Code text');
    expect(code).toHaveClass(
      'bg-gray-100',
      'px-1',
      'py-0.5',
      'rounded',
      'text-sm',
      'font-mono',
    );
  });

  it('passes through additional props', () => {
    render(
      <CodeMark data-testid="test-code" id="test-id">
        Code text
      </CodeMark>,
    );

    const code = screen.getByTestId('test-code');
    expect(code).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    const { container } = render(<CodeMark />);

    const code = container.querySelector('code');
    expect(code).toBeInTheDocument();
    expect(code).toBeEmptyDOMElement();
  });
});
