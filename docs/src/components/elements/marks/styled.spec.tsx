import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Styled } from './styled';

describe('Styled', () => {
  it('renders span with className from class prop', () => {
    render(<Styled class="custom-class">Styled text</Styled>);
    const element = screen.getByText('Styled text');
    expect(element.tagName).toBe('SPAN');
    expect(element).toHaveClass('custom-class');
  });

  it('renders children correctly', () => {
    render(
      <Styled class="wrapper">
        <em>Emphasized</em>
      </Styled>,
    );
    expect(screen.getByText('Emphasized')).toBeInTheDocument();
  });

  it('applies additional props', () => {
    render(
      <Styled class="test" data-testid="styled-span" aria-label="Custom styled">
        Content
      </Styled>,
    );
    const element = screen.getByTestId('styled-span');
    expect(element).toHaveAttribute('aria-label', 'Custom styled');
  });

  it('renders without class prop', () => {
    render(<Styled>No class</Styled>);
    const element = screen.getByText('No class');
    expect(element.tagName).toBe('SPAN');
    expect(element.className).toBe('');
  });
});
