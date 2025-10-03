import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { H4 } from './h4';

describe('H4', () => {
  it('renders h4 with children', () => {
    render(<H4>Test heading</H4>);

    const heading = screen.getByText('Test heading');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H4');
  });

  it('applies correct CSS classes', () => {
    render(<H4>Test heading</H4>);

    const heading = screen.getByText('Test heading');
    expect(heading).toHaveClass(
      'text-xl',
      'md:text-2xl',
      'font-bold',
      'mb-4',
      'last:mb-0',
      'text-pretty',
    );
  });

  it('passes through additional props', () => {
    render(
      <H4 data-testid="test-h4" id="test-id">
        Test heading
      </H4>,
    );

    const heading = screen.getByTestId('test-h4');
    expect(heading).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    render(<H4 />);

    const heading = screen.getByRole('heading', { level: 4 });
    expect(heading).toBeInTheDocument();
    expect(heading).toBeEmptyDOMElement();
  });
});
