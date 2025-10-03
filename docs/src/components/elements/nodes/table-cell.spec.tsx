import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TableCell } from './table-cell';

describe('TableCell', () => {
  it('renders td with children', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Cell content</TableCell>
          </tr>
        </tbody>
      </table>,
    );

    const cell = screen.getByText('Cell content');
    expect(cell).toBeInTheDocument();
    expect(cell.tagName).toBe('TD');
  });

  it('applies correct CSS classes', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Cell content</TableCell>
          </tr>
        </tbody>
      </table>,
    );

    const cell = screen.getByText('Cell content');
    expect(cell).toHaveClass('border', 'border-gray-300', 'px-2', 'py-1');
  });

  it('passes through additional props', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell data-testid="test-cell" id="test-id">
              Cell content
            </TableCell>
          </tr>
        </tbody>
      </table>,
    );

    const cell = screen.getByTestId('test-cell');
    expect(cell).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell />
          </tr>
        </tbody>
      </table>,
    );

    const cell = screen.getByRole('cell');
    expect(cell).toBeInTheDocument();
    expect(cell).toBeEmptyDOMElement();
  });
});
