import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Ol } from './ol';

describe('Ol', () => {
  it('renders ol with children', () => {
    render(
      <Ol>
        <li>Item 1</li>
        <li>Item 2</li>
      </Ol>,
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(
      <Ol>
        <li>Item 1</li>
      </Ol>,
    );

    const ol = screen.getByRole('list');
    expect(ol).toHaveClass(
      'list-decimal',
      'list-inside',
      'mb-4',
      'last:mb-0',
      'text-pretty',
    );
  });

  it('passes through additional props', () => {
    render(
      <Ol data-testid="test-ol" id="test-id">
        <li>Item 1</li>
      </Ol>,
    );

    const ol = screen.getByTestId('test-ol');
    expect(ol).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    render(<Ol />);

    const ol = screen.getByRole('list');
    expect(ol).toBeInTheDocument();
    expect(ol).toBeEmptyDOMElement();
  });
});
