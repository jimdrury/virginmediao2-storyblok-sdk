import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Emoji } from './emoji';

describe('Emoji', () => {
  it('renders emoji when emoji prop is provided', () => {
    render(<Emoji emoji="😀" name="smile" />);
    const element = screen.getByText('😀');
    expect(element.tagName).toBe('SPAN');
  });

  it('renders fallback image when fallbackImage is provided and no emoji', () => {
    render(<Emoji name="test-emoji" fallbackImage="/emoji.png" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/emoji.png');
    expect(img).toHaveAttribute('alt', 'test-emoji');
    expect(img).toHaveClass('inline-block');
  });

  it('uses "emoji" as default alt when name is not provided', () => {
    render(<Emoji fallbackImage="/emoji.png" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'emoji');
  });

  it('renders children when neither emoji nor fallbackImage is provided', () => {
    render(<Emoji name="custom">Fallback text</Emoji>);
    const element = screen.getByText('Fallback text');
    expect(element.tagName).toBe('SPAN');
  });

  it('prioritizes emoji over fallbackImage', () => {
    render(<Emoji emoji="🎉" fallbackImage="/emoji.png" name="party" />);
    expect(screen.getByText('🎉')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('prioritizes fallbackImage over children', () => {
    render(
      <Emoji fallbackImage="/emoji.png" name="test">
        Should not render
      </Emoji>,
    );
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.queryByText('Should not render')).not.toBeInTheDocument();
  });
});
