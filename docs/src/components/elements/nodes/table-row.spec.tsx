import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TableRow } from './table-row';

describe('TableRow', () => {
  it('renders tr with children', () => {
    render(
      <table>
        <tbody>
          <TableRow>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </TableRow>
        </tbody>
      </table>,
    );

    expect(screen.getByText('Cell 1')).toBeInTheDocument();
    expect(screen.getByText('Cell 2')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(
      <table>
        <tbody>
          <TableRow>
            <td>Cell 1</td>
          </TableRow>
        </tbody>
      </table>,
    );

    const row = screen.getByRole('row');
    expect(row).toHaveClass('border-b', 'border-gray-300');
  });

  it('passes through additional props', () => {
    render(
      <table>
        <tbody>
          <TableRow data-testid="test-row" id="test-id">
            <td>Cell 1</td>
          </TableRow>
        </tbody>
      </table>,
    );

    const row = screen.getByTestId('test-row');
    expect(row).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    render(
      <table>
        <tbody>
          <TableRow />
        </tbody>
      </table>,
    );

    const row = screen.getByRole('row');
    expect(row).toBeInTheDocument();
    expect(row).toBeEmptyDOMElement();
  });
});
