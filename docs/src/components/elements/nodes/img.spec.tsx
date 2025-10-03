import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Img } from './img';

describe('Img', () => {
  it('renders img with src and alt', () => {
    render(<Img src="/test.jpg" alt="Test image" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/test.jpg');
    expect(img).toHaveAttribute('alt', 'Test image');
  });

  it('applies default CSS classes', () => {
    render(<Img src="/image.png" alt="Image" />);
    const img = screen.getByRole('img');
    expect(img).toHaveClass('text-2xl', 'font-bold');
  });

  it('applies additional props', () => {
    render(
      <Img
        src="/photo.jpg"
        alt="Photo"
        data-testid="custom-img"
        title="Custom title"
      />,
    );
    const img = screen.getByTestId('custom-img');
    expect(img).toHaveAttribute('title', 'Custom title');
  });

  it('renders with width and height', () => {
    render(<Img src="/icon.svg" alt="Icon" width={100} height={100} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('width', '100');
    expect(img).toHaveAttribute('height', '100');
  });
});
