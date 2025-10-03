import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './header';

describe('Header', () => {
  it('renders header element', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('renders Virgin Media O2 logo', () => {
    render(<Header />);
    const logo = screen.getByAltText('Virgin Media O2 Logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders start content', () => {
    render(<Header start={<button type="button">Start Button</button>} />);
    expect(screen.getByText('Start Button')).toBeInTheDocument();
  });

  it('renders end content', () => {
    render(<Header end={<button type="button">End Button</button>} />);
    expect(screen.getByText('End Button')).toBeInTheDocument();
  });

  it('renders both start and end content', () => {
    render(<Header start={<span>Left</span>} end={<span>Right</span>} />);
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('shadow-md', 'px-2', 'py-4', 'bg-white');
  });

  it('renders without start and end props', () => {
    render(<Header />);
    expect(screen.getByAltText('Virgin Media O2 Logo')).toBeInTheDocument();
  });
});
