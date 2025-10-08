import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Highlight } from './highlight';

describe('Highlight', () => {
  it('renders mark with children', () => {
    render(<Highlight>Highlighted text</Highlight>);

    const highlight = screen.getByText('Highlighted text');
    expect(highlight).toBeInTheDocument();
    expect(highlight.tagName).toBe('MARK');
  });

  it('applies correct CSS classes', () => {
    render(<Highlight>Highlighted text</Highlight>);

    const highlight = screen.getByText('Highlighted text');
    expect(highlight).toHaveClass('bg-yellow-200');
  });

  it('passes through additional props', () => {
    render(
      <Highlight data-testid="test-highlight" id="test-id">
        Highlighted text
      </Highlight>,
    );

    const highlight = screen.getByTestId('test-highlight');
    expect(highlight).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    const { container } = render(<Highlight />);

    const highlight = container.querySelector('mark');
    expect(highlight).toBeInTheDocument();
    expect(highlight).toBeEmptyDOMElement();
  });
});
