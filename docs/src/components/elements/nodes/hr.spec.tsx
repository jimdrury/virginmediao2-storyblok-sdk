import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hr } from './hr';

describe('Hr', () => {
  it('renders hr element', () => {
    const { container } = render(<Hr />);

    const hr = container.querySelector('hr');
    expect(hr).toBeInTheDocument();
    expect(hr?.tagName).toBe('HR');
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<Hr />);

    const hr = container.querySelector('hr');
    expect(hr).toHaveClass('border-gray-300', 'my-4');
  });
});
