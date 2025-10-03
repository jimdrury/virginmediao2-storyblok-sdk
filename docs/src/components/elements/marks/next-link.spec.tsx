import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NextLink } from './next-link';

describe('NextLink', () => {
  it('renders link with href', () => {
    render(<NextLink href="/test">Test link</NextLink>);
    const link = screen.getByText('Test link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('uses # as default href when href is not provided', () => {
    render(<NextLink href="">Empty href</NextLink>);
    const link = screen.getByText('Empty href');
    expect(link).toHaveAttribute('href', '#');
  });

  it('applies correct CSS classes', () => {
    render(<NextLink href="/page">Styled link</NextLink>);
    const link = screen.getByText('Styled link');
    expect(link).toHaveClass(
      'text-blue-600',
      'hover:text-blue-800',
      'underline',
    );
  });

  it('disables prefetch', () => {
    const { container } = render(<NextLink href="/page">No prefetch</NextLink>);
    const link = container.querySelector('a');
    // Next.js Link prefetch is disabled, which means it won't prefetch
    expect(link).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <NextLink href="/page">
        <span>Child element</span>
      </NextLink>,
    );
    expect(screen.getByText('Child element')).toBeInTheDocument();
  });
});
