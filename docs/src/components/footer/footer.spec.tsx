import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './footer';

describe('Footer', () => {
  it('renders footer navigation', () => {
    render(<Footer />);
    expect(screen.getByLabelText('Footer Navigation')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Footer />);
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Terms & Conditions')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Cookies Policy')).toBeInTheDocument();
    expect(screen.getByText('Modern Slavery Statement')).toBeInTheDocument();
    expect(screen.getByText('Access for all')).toBeInTheDocument();
    expect(screen.getByText('Corporate Statements')).toBeInTheDocument();
  });

  it('renders About Us link with correct href', () => {
    render(<Footer />);
    const link = screen.getByText('About Us');
    expect(link).toHaveAttribute('href', '/about');
  });

  it('renders Terms & Conditions link with correct href', () => {
    render(<Footer />);
    const link = screen.getByText('Terms & Conditions');
    expect(link).toHaveAttribute('href', '/terms');
  });

  it('renders Privacy Policy link with correct href', () => {
    render(<Footer />);
    const link = screen.getByText('Privacy Policy');
    expect(link).toHaveAttribute('href', '/privacy');
  });

  it('renders Virgin Media O2 logo', () => {
    render(<Footer />);
    const logo = screen.getByAltText('Virgin Media O2 Logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders copyright text', () => {
    render(<Footer />);
    expect(
      screen.getByText(/© 2025 Virgin Media. All Rights Reserved/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/© 2025 Telefonica. All Rights Reserved/),
    ).toBeInTheDocument();
  });

  it('renders horizontal rule', () => {
    const { container } = render(<Footer />);
    const hr = container.querySelector('hr');
    expect(hr).toBeInTheDocument();
    expect(hr).toHaveClass('border-white');
  });
});
