import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Italic } from './italic';

describe('Italic', () => {
  it('renders em with children', () => {
    render(<Italic>Italic text</Italic>);

    const italic = screen.getByText('Italic text');
    expect(italic).toBeInTheDocument();
    expect(italic.tagName).toBe('EM');
  });

  it('applies correct CSS classes', () => {
    render(<Italic>Italic text</Italic>);

    const italic = screen.getByText('Italic text');
    expect(italic).toHaveClass('italic');
  });

  it('passes through additional props', () => {
    render(
      <Italic data-testid="test-italic" id="test-id">
        Italic text
      </Italic>,
    );

    const italic = screen.getByTestId('test-italic');
    expect(italic).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    render(<Italic />);

    const italic = screen.getByRole('emphasis');
    expect(italic).toBeInTheDocument();
    expect(italic).toBeEmptyDOMElement();
  });
});
