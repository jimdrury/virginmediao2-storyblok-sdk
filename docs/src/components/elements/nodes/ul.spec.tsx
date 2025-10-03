import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Ul } from './ul';

describe('Ul', () => {
  it('renders ul with children', () => {
    render(
      <Ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </Ul>,
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(
      <Ul>
        <li>Item 1</li>
      </Ul>,
    );

    const ul = screen.getByRole('list');
    expect(ul).toHaveClass(
      'list-disc',
      'list-inside',
      'mb-4',
      'last:mb-0',
      'text-pretty',
    );
  });

  it('passes through additional props', () => {
    render(
      <Ul data-testid="test-ul" id="test-id">
        <li>Item 1</li>
      </Ul>,
    );

    const ul = screen.getByTestId('test-ul');
    expect(ul).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    render(<Ul />);

    const ul = screen.getByRole('list');
    expect(ul).toBeInTheDocument();
    expect(ul).toBeEmptyDOMElement();
  });
});
