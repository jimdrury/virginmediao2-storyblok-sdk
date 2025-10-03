import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Strike } from './strike';

describe('Strike', () => {
  it('renders del with children', () => {
    render(<Strike>Strikethrough text</Strike>);

    const strike = screen.getByText('Strikethrough text');
    expect(strike).toBeInTheDocument();
    expect(strike.tagName).toBe('DEL');
  });

  it('applies correct CSS classes', () => {
    render(<Strike>Strikethrough text</Strike>);

    const strike = screen.getByText('Strikethrough text');
    expect(strike).toHaveClass('line-through');
  });

  it('passes through additional props', () => {
    render(
      <Strike data-testid="test-strike" id="test-id">
        Strikethrough text
      </Strike>,
    );

    const strike = screen.getByTestId('test-strike');
    expect(strike).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    render(<Strike />);

    const strike = screen.getByRole('deletion');
    expect(strike).toBeInTheDocument();
    expect(strike).toBeEmptyDOMElement();
  });
});
