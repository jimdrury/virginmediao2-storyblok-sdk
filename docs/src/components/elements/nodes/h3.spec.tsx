import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { H3 } from './h3';

describe('H3', () => {
  it('renders h3 with children', () => {
    render(<H3>Test heading</H3>);

    const heading = screen.getByText('Test heading');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H3');
  });

  it('applies correct CSS classes', () => {
    render(<H3>Test heading</H3>);

    const heading = screen.getByText('Test heading');
    expect(heading).toHaveClass(
      'text-2xl',
      'md:text-3xl',
      'font-bold',
      'mb-4',
      'last:mb-0',
      'text-pretty',
    );
  });

  it('passes through additional props', () => {
    render(
      <H3 data-testid="test-h3" id="test-id">
        Test heading
      </H3>,
    );

    const heading = screen.getByTestId('test-h3');
    expect(heading).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    render(<H3 />);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toBeEmptyDOMElement();
  });
});
