import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BulkExportModal from '../src/renderer/components/BulkExportModal';

describe('BulkExportModal', () => {
  it('shows spinner and progress', () => {
    render(<BulkExportModal progress={{ current: 1, total: 3 }} />);
    expect(screen.getByTestId('daisy-modal')).toBeInTheDocument();
    expect(screen.getByText('1/3')).toBeInTheDocument();
  });
});
