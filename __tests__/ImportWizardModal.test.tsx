import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ImportWizardModal from '../src/renderer/components/modals/ImportWizardModal';

describe('ImportWizardModal', () => {
  it('shows spinner while importing', () => {
    render(<ImportWizardModal inProgress onClose={vi.fn()} />);
    expect(screen.getByText('Importing...')).toBeInTheDocument();
    expect(screen.getByLabelText('loading')).toBeInTheDocument();
  });

  it('displays summary', () => {
    const onClose = vi.fn();
    const summary = { name: 'Pack', fileCount: 3, durationMs: 1000 };
    render(<ImportWizardModal summary={summary} onClose={onClose} />);
    expect(screen.getByText('Import Complete')).toBeInTheDocument();
    expect(screen.getByText(/3 files/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });
});
