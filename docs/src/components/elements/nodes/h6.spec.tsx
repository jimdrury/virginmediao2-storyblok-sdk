import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { H6 } from './h6';

describe('H6', () => {
  it('renders h6 with children', () => {
    render(<H6>Test heading</H6>);

    const heading = screen.getByText('Test heading');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H6');
  });

  it('applies correct CSS classes', () => {
    render(<H6>Test heading</H6>);

    const heading = screen.getByText('Test heading');
    expect(heading).toHaveClass(
      'text-base',
      'md:text-lg',
      'font-bold',
      'mb-4',
      'last:mb-0',
      'text-pretty',
    );
  });

  it('passes through additional props', () => {
    render(
      <H6 data-testid="test-h6" id="test-id">
        Test heading
      </H6>,
    );

    const heading = screen.getByTestId('test-h6');
    expect(heading).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    render(<H6 />);

    const heading = screen.getByRole('heading', { level: 6 });
    expect(heading).toBeInTheDocument();
    expect(heading).toBeEmptyDOMElement();
  });
});
