import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Underline } from './underline';

describe('Underline', () => {
  it('renders u with children', () => {
    render(<Underline>Underlined text</Underline>);

    const underline = screen.getByText('Underlined text');
    expect(underline).toBeInTheDocument();
    expect(underline.tagName).toBe('U');
  });

  it('applies correct CSS classes', () => {
    render(<Underline>Underlined text</Underline>);

    const underline = screen.getByText('Underlined text');
    expect(underline).toHaveClass('underline');
  });

  it('passes through additional props', () => {
    render(
      <Underline data-testid="test-underline" id="test-id">
        Underlined text
      </Underline>,
    );

    const underline = screen.getByTestId('test-underline');
    expect(underline).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    const { container } = render(<Underline />);

    const underline = container.querySelector('u');
    expect(underline).toBeInTheDocument();
    expect(underline).toBeEmptyDOMElement();
  });
});
