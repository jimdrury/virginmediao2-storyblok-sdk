import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Paragraph } from './paragraph';

describe('Paragraph', () => {
  it('renders paragraph with children', () => {
    render(<Paragraph>Test paragraph content</Paragraph>);

    const paragraph = screen.getByText('Test paragraph content');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph.tagName).toBe('P');
  });

  it('applies correct CSS classes', () => {
    render(<Paragraph>Test paragraph content</Paragraph>);

    const paragraph = screen.getByText('Test paragraph content');
    expect(paragraph).toHaveClass(
      'mb-2',
      'last:mb-0',
      'text-base',
      'text-pretty',
    );
  });

  it('passes through additional props', () => {
    render(
      <Paragraph data-testid="test-paragraph" id="test-id">
        Test paragraph content
      </Paragraph>,
    );

    const paragraph = screen.getByTestId('test-paragraph');
    expect(paragraph).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    render(<Paragraph />);

    const paragraph = screen.getByRole('paragraph');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toBeEmptyDOMElement();
  });
});
