import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OSS_BLOK } from '@/storyblok/bloks';
import type { OssDivider as OssDividerType } from './oss-divider.blok';
import { OssDivider } from './oss-divider.blok';

const createMockBlok = (
  overrides?: Partial<OssDividerType>,
): { blok: OssDividerType } => ({
  blok: {
    _uid: 'test-uid',
    component: OSS_BLOK.DIVIDER,
    text: 'Test divider',
    color: 'neutral',
    ...overrides,
  },
});

describe('OssDivider', () => {
  it('renders divider with text', () => {
    render(<OssDivider {...createMockBlok()} />);
    expect(screen.getByText('Test divider')).toBeInTheDocument();
  });

  it('applies neutral color class', () => {
    render(<OssDivider {...createMockBlok({ color: 'neutral' })} />);
    const divider = screen.getByText('Test divider');
    expect(divider).toHaveClass('divider', 'divider-neutral');
  });

  it('applies primary color class', () => {
    render(<OssDivider {...createMockBlok({ color: 'primary' })} />);
    const divider = screen.getByText('Test divider');
    expect(divider).toHaveClass('divider', 'divider-primary');
  });

  it('applies secondary color class', () => {
    render(<OssDivider {...createMockBlok({ color: 'secondary' })} />);
    const divider = screen.getByText('Test divider');
    expect(divider).toHaveClass('divider', 'divider-secondary');
  });

  it('applies accent color class', () => {
    render(<OssDivider {...createMockBlok({ color: 'accent' })} />);
    const divider = screen.getByText('Test divider');
    expect(divider).toHaveClass('divider', 'divider-accent');
  });

  it('applies success color class', () => {
    render(<OssDivider {...createMockBlok({ color: 'success' })} />);
    const divider = screen.getByText('Test divider');
    expect(divider).toHaveClass('divider', 'divider-success');
  });

  it('applies warning color class', () => {
    render(<OssDivider {...createMockBlok({ color: 'warning' })} />);
    const divider = screen.getByText('Test divider');
    expect(divider).toHaveClass('divider', 'divider-warning');
  });

  it('applies info color class', () => {
    render(<OssDivider {...createMockBlok({ color: 'info' })} />);
    const divider = screen.getByText('Test divider');
    expect(divider).toHaveClass('divider', 'divider-info');
  });

  it('applies error color class', () => {
    render(<OssDivider {...createMockBlok({ color: 'error' })} />);
    const divider = screen.getByText('Test divider');
    expect(divider).toHaveClass('divider', 'divider-error');
  });
});
