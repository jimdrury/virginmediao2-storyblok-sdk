import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Table } from './table';

describe('Table', () => {
  it('renders table with children', () => {
    render(
      <Table>
        <tr>
          <td>Cell 1</td>
          <td>Cell 2</td>
        </tr>
      </Table>,
    );

    expect(screen.getByText('Cell 1')).toBeInTheDocument();
    expect(screen.getByText('Cell 2')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(
      <Table>
        <tr>
          <td>Cell 1</td>
        </tr>
      </Table>,
    );

    const table = screen.getByRole('table');
    expect(table).toHaveClass('w-full', 'border-collapse', 'mb-4', 'last:mb-0');
  });

  it('passes through additional props', () => {
    render(
      <Table data-testid="test-table" id="test-id">
        <tr>
          <td>Cell 1</td>
        </tr>
      </Table>,
    );

    const table = screen.getByTestId('test-table');
    expect(table).toHaveAttribute('id', 'test-id');
  });

  it('renders without children', () => {
    render(<Table />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    expect(table.firstChild).toBeEmptyDOMElement();
  });
});
