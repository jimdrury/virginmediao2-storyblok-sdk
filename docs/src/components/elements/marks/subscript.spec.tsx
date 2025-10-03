import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Subscript } from './subscript';

describe('Subscript', () => {
  it('renders sub with children', () => {
    render(<Subscript>Subscript text</Subscript>);

    const subscript = screen.getByText('Subscript text');
    expect(subscript).toBeInTheDocument();
    expect(subscript.tagName).toBe('SUB');
  });

  it('applies correct CSS classes', () => {
    render(<Subscript>Subscript text</Subscript>);

    const subscript = screen.getByText('Subscript text');
    expect(subscript).toHaveClass('text-sm');
  });

  it('passes through additional props', () => {
    render(
      <Subscript data-testid="test-subscript" id="test-id">
        Subscript text
      </Subscript>,
    );

    const subscript = screen.getByTestId('test-subscript');
    expect(subscript).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    const { container } = render(<Subscript />);

    const subscript = container.querySelector('sub');
    expect(subscript).toBeInTheDocument();
    expect(subscript).toBeEmptyDOMElement();
  });
});
