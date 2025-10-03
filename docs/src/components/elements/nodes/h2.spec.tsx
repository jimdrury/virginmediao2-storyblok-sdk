import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { H2 } from './h2';

describe('H2', () => {
  it('renders h2 with children', () => {
    render(<H2>Test heading</H2>);

    const heading = screen.getByText('Test heading');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
  });

  it('applies correct CSS classes', () => {
    render(<H2>Test heading</H2>);

    const heading = screen.getByText('Test heading');
    expect(heading).toHaveClass(
      'text-3xl',
      'md:text-4xl',
      'font-bold',
      'mb-4',
      'last:mb-0',
      'text-pretty',
    );
  });

  it('passes through additional props', () => {
    render(
      <H2 data-testid="test-h2" id="test-id">
        Test heading
      </H2>,
    );

    const heading = screen.getByTestId('test-h2');
    expect(heading).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    render(<H2 />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toBeEmptyDOMElement();
  });
});
