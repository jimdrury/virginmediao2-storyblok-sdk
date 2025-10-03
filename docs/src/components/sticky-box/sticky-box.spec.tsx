import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StickyBox } from './sticky-box';

describe('StickyBox', () => {
  it('renders children', () => {
    render(
      <StickyBox>
        <div>Test content</div>
      </StickyBox>,
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <StickyBox className="custom-class">
        <div>Content</div>
      </StickyBox>,
    );
    const box = container.firstChild as HTMLElement;
    expect(box).toHaveClass('custom-class');
  });

  it('renders without children', () => {
    const { container } = render(<StickyBox />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders div element', () => {
    const { container } = render(
      <StickyBox>
        <div>Content</div>
      </StickyBox>,
    );
    const box = container.firstChild as HTMLElement;
    expect(box.tagName).toBe('DIV');
  });
});
