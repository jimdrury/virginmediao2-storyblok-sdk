import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Alert } from './alert';

describe('Alert', () => {
  it('should render with title and children', () => {
    render(
      <Alert title="Test Title">
        <p>Test content</p>
      </Alert>,
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should apply alert base class', () => {
    const { container } = render(<Alert title="Info">Content</Alert>);

    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('alert');
  });

  it('should apply info variant by default', () => {
    const { container } = render(<Alert title="Info">Content</Alert>);

    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('alert-info');
  });

  it('should apply success variant styles', () => {
    const { container } = render(
      <Alert title="Success" variant="success">
        Content
      </Alert>,
    );

    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('alert-success');
  });

  it('should apply warning variant styles', () => {
    const { container } = render(
      <Alert title="Warning" variant="warning">
        Content
      </Alert>,
    );

    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('alert-warning');
  });

  it('should apply error variant styles', () => {
    const { container } = render(
      <Alert title="Error" variant="error">
        Content
      </Alert>,
    );

    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('alert-error');
  });

  it('should apply soft styles when soft prop is true', () => {
    const { container } = render(
      <Alert title="Soft" variant="info" decoration="soft">
        Content
      </Alert>,
    );

    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('alert-soft');
  });

  it('should apply outline border style', () => {
    const { container } = render(
      <Alert title="Outline" decoration="outline">
        Content
      </Alert>,
    );

    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('alert-outline');
  });

  it('should apply dashed border style', () => {
    const { container } = render(
      <Alert title="Dashed" decoration="dash">
        Content
      </Alert>,
    );

    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('alert-dash');
  });

  it('should have no border classes when border is none', () => {
    const { container } = render(
      <Alert title="No Border" decoration="none">
        Content
      </Alert>,
    );

    const alert = container.firstChild as HTMLElement;
    expect(alert).not.toHaveClass('alert-outline');
    expect(alert).not.toHaveClass('alert-dash');
  });

  it('should have role="alert" for accessibility', () => {
    const { container } = render(
      <Alert title="Alert" role="alert">
        Content
      </Alert>,
    );

    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveAttribute('role', 'alert');
  });

  it('should combine multiple classes correctly', () => {
    const { container } = render(
      <Alert title="Combined" variant="success" decoration="soft">
        Content
      </Alert>,
    );

    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('alert');
    expect(alert).toHaveClass('alert-success');
    expect(alert).toHaveClass('alert-soft');
  });
});
