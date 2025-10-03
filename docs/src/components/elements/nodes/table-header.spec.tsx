import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TableHeader } from './table-header';

describe('TableHeader', () => {
  it('renders th with children', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableHeader>Header content</TableHeader>
          </tr>
        </tbody>
      </table>,
    );

    const header = screen.getByText('Header content');
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe('TH');
  });

  it('applies correct CSS classes', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableHeader>Header content</TableHeader>
          </tr>
        </tbody>
      </table>,
    );

    const header = screen.getByText('Header content');
    expect(header).toHaveClass(
      'border',
      'border-gray-300',
      'px-2',
      'py-1',
      'font-semibold',
      'bg-gray-100',
    );
  });

  it('passes through additional props', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableHeader data-testid="test-header" id="test-id">
              Header content
            </TableHeader>
          </tr>
        </tbody>
      </table>,
    );

    const header = screen.getByTestId('test-header');
    expect(header).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableHeader />
          </tr>
        </tbody>
      </table>,
    );

    const header = screen.getByRole('columnheader');
    expect(header).toBeInTheDocument();
    expect(header).toBeEmptyDOMElement();
  });
});
