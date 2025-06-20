import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Table from '../../../src/renderer/components/daisy/display/Table';

describe('Table', () => {
  it('renders and accepts props', () => {
    render(
      <Table
        id="tbl1"
        className="extra"
        head={
          <tr>
            <th>H</th>
          </tr>
        }
      >
        <tr>
          <td>A</td>
        </tr>
      </Table>
    );
    const table = screen.getByTestId('table');
    expect(table).toBeInTheDocument();
    expect(table).toHaveClass('extra');
    expect(table).toHaveAttribute('id', 'tbl1');
  });
});
