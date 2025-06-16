import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ExportWizardModal, {
  BulkProgress,
} from '../src/renderer/components/ExportWizardModal';

const summary = {
  fileCount: 5,
  totalSize: 1024 * 1024,
  durationMs: 2000,
  warnings: ['warn'],
};

describe('ExportWizardModal', () => {
  it('shows progress indicator', () => {
    const progress: BulkProgress = { current: 1, total: 4 };
    render(<ExportWizardModal progress={progress} onClose={vi.fn()} />);
    expect(screen.getByText('Exporting...')).toBeInTheDocument();
    expect(screen.getByTestId('radial-progress')).toBeInTheDocument();
    expect(screen.getByText('1/4')).toBeInTheDocument();
  });

  it('displays summary with actions', () => {
    const onClose = vi.fn();
    const onOpen = vi.fn();
    render(
      <ExportWizardModal
        summary={summary}
        onClose={onClose}
        onOpenFolder={onOpen}
      />
    );
    expect(screen.getByText('Export Complete')).toBeInTheDocument();
    expect(screen.getByText(/5 files/)).toBeInTheDocument();
    expect(screen.getByText(/1.00 MB/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
    fireEvent.click(screen.getByText('Open Folder'));
    expect(onOpen).toHaveBeenCalled();
  });
});
