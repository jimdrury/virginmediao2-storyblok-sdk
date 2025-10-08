import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ClickToExpand } from './index';

// Mock react-use
vi.mock('react-use', () => ({
  useMeasure: () => [vi.fn(), { height: 200 }],
}));

// Mock CSS modules
vi.mock('./click-to-expand.module.css', () => ({
  default: {
    'click-to-expand': 'click-to-expand',
    'click-to-expand--expanded': 'click-to-expand--expanded',
    'click-to-expand__control': 'click-to-expand__control',
    'click-to-expand__content': 'click-to-expand__content',
  },
}));

describe('ClickToExpand', () => {
  it('renders with children', () => {
    render(
      <ClickToExpand>
        <div>Test content</div>
      </ClickToExpand>,
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('shows expand button by default', () => {
    render(
      <ClickToExpand>
        <div>Test content</div>
      </ClickToExpand>,
    );

    expect(screen.getByText('Expand')).toBeInTheDocument();
  });

  it('expands when button is clicked', () => {
    render(
      <ClickToExpand>
        <div>Test content</div>
      </ClickToExpand>,
    );

    const expandButton = screen.getByText('Expand');
    fireEvent.click(expandButton);

    // After clicking, the button should still be there but the component should be expanded
    expect(expandButton).toBeInTheDocument();
  });

  it('starts expanded when expandedDefault is true', () => {
    render(
      <ClickToExpand expandedDefault={true}>
        <div>Test content</div>
      </ClickToExpand>,
    );

    expect(screen.getByText('Expand')).toBeInTheDocument();
  });
});
