import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Quote } from './quote';

describe('Quote', () => {
  it('renders blockquote with children', () => {
    render(<Quote>Quote text</Quote>);

    const quote = screen.getByText('Quote text');
    expect(quote).toBeInTheDocument();
    expect(quote.tagName).toBe('BLOCKQUOTE');
  });

  it('applies correct CSS classes', () => {
    render(<Quote>Quote text</Quote>);

    const quote = screen.getByText('Quote text');
    expect(quote).toHaveClass(
      'border-l-4',
      'border-gray-300',
      'pl-4',
      'italic',
      'mb-4',
      'last:mb-0',
    );
  });

  it('passes through additional props', () => {
    render(
      <Quote data-testid="test-quote" id="test-id">
        Quote text
      </Quote>,
    );

    const quote = screen.getByTestId('test-quote');
    expect(quote).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    render(<Quote />);

    const quote = screen.getByRole('blockquote');
    expect(quote).toBeInTheDocument();
    expect(quote).toBeEmptyDOMElement();
  });
});
