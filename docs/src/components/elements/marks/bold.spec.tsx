import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Bold } from './bold';

describe('Bold', () => {
  it('renders strong with children', () => {
    render(<Bold>Bold text</Bold>);

    const bold = screen.getByText('Bold text');
    expect(bold).toBeInTheDocument();
    expect(bold.tagName).toBe('STRONG');
  });

  it('applies correct CSS classes', () => {
    render(<Bold>Bold text</Bold>);

    const bold = screen.getByText('Bold text');
    expect(bold).toHaveClass('font-bold');
  });

  it('passes through additional props', () => {
    render(
      <Bold data-testid="test-bold" id="test-id">
        Bold text
      </Bold>,
    );

    const bold = screen.getByTestId('test-bold');
    expect(bold).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    render(<Bold />);

    const bold = screen.getByRole('strong');
    expect(bold).toBeInTheDocument();
    expect(bold).toBeEmptyDOMElement();
  });
});
