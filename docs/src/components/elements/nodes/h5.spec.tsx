import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { H5 } from './h5';

describe('H5', () => {
  it('renders h5 with children', () => {
    render(<H5>Test heading</H5>);

    const heading = screen.getByText('Test heading');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H5');
  });

  it('applies correct CSS classes', () => {
    render(<H5>Test heading</H5>);

    const heading = screen.getByText('Test heading');
    expect(heading).toHaveClass(
      'text-lg',
      'md:text-xl',
      'font-bold',
      'mb-4',
      'last:mb-0',
      'text-pretty',
    );
  });

  it('passes through additional props', () => {
    render(
      <H5 data-testid="test-h5" id="test-id">
        Test heading
      </H5>,
    );

    const heading = screen.getByTestId('test-h5');
    expect(heading).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    render(<H5 />);

    const heading = screen.getByRole('heading', { level: 5 });
    expect(heading).toBeInTheDocument();
    expect(heading).toBeEmptyDOMElement();
  });
});
