import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Li } from './li';

describe('Li', () => {
  it('renders li with children', () => {
    render(<Li>List item</Li>);

    const li = screen.getByText('List item');
    expect(li).toBeInTheDocument();
    expect(li.tagName).toBe('LI');
  });

  it('applies correct CSS classes', () => {
    render(<Li>List item</Li>);

    const li = screen.getByText('List item');
    expect(li).toHaveClass('mb-1', 'text-pretty');
  });

  it('passes through additional props', () => {
    render(
      <Li data-testid="test-li" id="test-id">
        List item
      </Li>,
    );

    const li = screen.getByTestId('test-li');
    expect(li).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    render(<Li />);

    const li = screen.getByRole('listitem');
    expect(li).toBeInTheDocument();
    expect(li).toBeEmptyDOMElement();
  });
});
