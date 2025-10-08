import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TextStyle } from './text-style';

describe('TextStyle', () => {
  it('renders span with color style', () => {
    render(<TextStyle color="red">Colored text</TextStyle>);
    const element = screen.getByText('Colored text');
    expect(element.tagName).toBe('SPAN');
    expect(element.style.color).toBeTruthy();
  });

  it('renders children correctly', () => {
    render(
      <TextStyle color="blue">
        <strong>Bold blue</strong>
      </TextStyle>,
    );
    expect(screen.getByText('Bold blue')).toBeInTheDocument();
  });

  it('merges color with additional styles', () => {
    render(
      <TextStyle color="green" style={{ fontSize: '20px', fontWeight: 'bold' }}>
        Styled text
      </TextStyle>,
    );
    const element = screen.getByText('Styled text');
    expect(element.style.color).toBeTruthy();
    expect(element.style.fontSize).toBe('20px');
    expect(element.style.fontWeight).toBe('bold');
  });

  it('renders without color', () => {
    render(<TextStyle>No color</TextStyle>);
    const element = screen.getByText('No color');
    expect(element.tagName).toBe('SPAN');
  });

  it('applies additional props', () => {
    render(
      <TextStyle color="purple" data-testid="text-style-span">
        Content
      </TextStyle>,
    );
    const element = screen.getByTestId('text-style-span');
    expect(element.style.color).toBeTruthy();
  });
});
