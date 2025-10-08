import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { H1 } from './h1';

describe('H1', () => {
  it('renders h1 with children', () => {
    render(<H1>Test heading</H1>);

    const heading = screen.getByText('Test heading');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('applies correct CSS classes', () => {
    render(<H1>Test heading</H1>);

    const heading = screen.getByText('Test heading');
    expect(heading).toHaveClass(
      'text-4xl',
      'md:text-5xl',
      'font-extrabold',
      'mb-6',
      'last:mb-0',
      'text-pretty',
    );
  });

  it('passes through additional props', () => {
    render(
      <H1 data-testid="test-h1" id="test-id">
        Test heading
      </H1>,
    );

    const heading = screen.getByTestId('test-h1');
    expect(heading).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    render(<H1 />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toBeEmptyDOMElement();
  });
});
