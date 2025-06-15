import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Table from '../../../src/renderer/components/daisy/display/Table';

describe('Table', () => {
  it('renders', () => {
    render(
      <Table
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
    expect(screen.getByTestId('table')).toBeInTheDocument();
  });
});
