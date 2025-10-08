import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Anchor } from './anchor';

describe('Anchor', () => {
  it('renders span with id', () => {
    render(<Anchor id="test-anchor">Test content</Anchor>);
    const element = screen.getByText('Test content');
    expect(element.tagName).toBe('SPAN');
    expect(element.id).toBe('test-anchor');
  });

  it('renders children correctly', () => {
    render(
      <Anchor id="anchor-1">
        <strong>Bold text</strong>
      </Anchor>,
    );
    expect(screen.getByText('Bold text')).toBeInTheDocument();
  });

  it('applies additional props', () => {
    render(
      <Anchor id="test" data-testid="custom-anchor" aria-label="Test anchor">
        Content
      </Anchor>,
    );
    const element = screen.getByTestId('custom-anchor');
    expect(element).toHaveAttribute('aria-label', 'Test anchor');
  });

  it('renders without id', () => {
    render(<Anchor>No ID content</Anchor>);
    const element = screen.getByText('No ID content');
    expect(element.tagName).toBe('SPAN');
    expect(element.id).toBe('');
  });
});
