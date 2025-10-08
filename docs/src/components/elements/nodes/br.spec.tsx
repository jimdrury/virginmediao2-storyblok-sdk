import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Br } from './br';

describe('Br', () => {
  it('renders br element', () => {
    const { container } = render(<Br />);

    const br = container.querySelector('br');
    expect(br).toBeInTheDocument();
    expect(br?.tagName).toBe('BR');
  });

  it('renders without props', () => {
    const { container } = render(<Br />);

    const br = container.querySelector('br');
    expect(br).toBeInTheDocument();
  });
});
