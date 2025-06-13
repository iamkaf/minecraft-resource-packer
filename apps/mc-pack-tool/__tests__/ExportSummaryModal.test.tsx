import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ExportSummaryModal from '../src/renderer/components/ExportSummaryModal';

const summary = {
  fileCount: 5,
  totalSize: 1024 * 1024,
  durationMs: 2000,
  warnings: ['warn'],
};

describe('ExportSummaryModal', () => {
  it('displays summary info and warnings', () => {
    render(<ExportSummaryModal summary={summary} onClose={() => undefined} />);
    expect(screen.getByText('Export Complete')).toBeInTheDocument();
    expect(screen.getByText(/5 files/)).toBeInTheDocument();
    expect(screen.getByText(/1.00 MB/)).toBeInTheDocument();
    expect(screen.getByText(/2.0 seconds/)).toBeInTheDocument();
    expect(screen.getByText('warn')).toBeInTheDocument();
  });

  it('calls onClose when Close clicked', () => {
    const cb = vi.fn();
    render(<ExportSummaryModal summary={summary} onClose={cb} />);
    fireEvent.click(screen.getByText('Close'));
    expect(cb).toHaveBeenCalled();
  });
});
