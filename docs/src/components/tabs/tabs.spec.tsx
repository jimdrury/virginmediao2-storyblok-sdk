import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tabs } from './tabs';

describe('Tabs', () => {
  it('renders with children', () => {
    render(
      <Tabs label="Test tabs">
        <div>Tab content</div>
      </Tabs>,
    );

    expect(screen.getByText('Tab content')).toBeInTheDocument();
  });

  it('renders with correct label', () => {
    render(
      <Tabs label="Test tabs">
        <div>Tab content</div>
      </Tabs>,
    );

    expect(screen.getByText('Test tabs')).toBeInTheDocument();
  });

  it('applies default variant class', () => {
    const { container } = render(
      <Tabs label="Test tabs">
        <div>Tab content</div>
      </Tabs>,
    );

    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist).toHaveClass('tabs-lift');
  });

  it('applies border variant class', () => {
    const { container } = render(
      <Tabs label="Test tabs" variant="border">
        <div>Tab content</div>
      </Tabs>,
    );

    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist).toHaveClass('tabs-border');
  });

  it('applies box variant class', () => {
    const { container } = render(
      <Tabs label="Test tabs" variant="box">
        <div>Tab content</div>
      </Tabs>,
    );

    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist).toHaveClass('tabs-box');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Tabs label="Test tabs" className="custom-class">
        <div>Tab content</div>
      </Tabs>,
    );

    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist).toHaveClass('custom-class');
  });

  it('has correct accessibility attributes', () => {
    const { container } = render(
      <Tabs label="Test tabs">
        <div>Tab content</div>
      </Tabs>,
    );

    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist).toHaveAttribute('aria-labelledby');

    const label = screen.getByText('Test tabs');
    expect(label).toHaveAttribute('id');
  });
});
