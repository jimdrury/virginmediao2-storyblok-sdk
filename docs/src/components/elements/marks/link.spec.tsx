import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Link } from './link';

describe('Link', () => {
  it('renders a with children', () => {
    render(<Link href="/test">Link text</Link>);

    const link = screen.getByText('Link text');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
  });

  it('applies correct CSS classes', () => {
    render(<Link href="/test">Link text</Link>);

    const link = screen.getByText('Link text');
    expect(link).toHaveClass(
      'text-blue-600',
      'hover:text-blue-800',
      'underline',
    );
  });

  it('passes through additional props', () => {
    render(
      <Link href="/test" data-testid="test-link" id="test-id">
        Link text
      </Link>,
    );

    const link = screen.getByTestId('test-link');
    expect(link).toHaveAttribute('id', 'test-id');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('renders without children', () => {
    render(<Link href="/test" />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toBeEmptyDOMElement();
  });
});
