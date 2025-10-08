import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Superscript } from './superscript';

describe('Superscript', () => {
  it('renders sup with children', () => {
    render(<Superscript>Superscript text</Superscript>);

    const superscript = screen.getByText('Superscript text');
    expect(superscript).toBeInTheDocument();
    expect(superscript.tagName).toBe('SUP');
  });

  it('applies correct CSS classes', () => {
    render(<Superscript>Superscript text</Superscript>);

    const superscript = screen.getByText('Superscript text');
    expect(superscript).toHaveClass('text-sm');
  });

  it('passes through additional props', () => {
    render(
      <Superscript data-testid="test-superscript" id="test-id">
        Superscript text
      </Superscript>,
    );

    const superscript = screen.getByTestId('test-superscript');
    expect(superscript).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    const { container } = render(<Superscript />);

    const superscript = container.querySelector('sup');
    expect(superscript).toBeInTheDocument();
    expect(superscript).toBeEmptyDOMElement();
  });
});
