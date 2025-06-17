import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImportWizard from '../src/renderer/components/ImportWizard';

interface API {
  importProject: () => Promise<void>;
}

describe('ImportWizard', () => {
  it('walks through steps', async () => {
    const imp = vi.fn().mockResolvedValue(undefined);
    (window as unknown as { electronAPI: API }).electronAPI = {
      importProject: imp,
    };
    const onClose = vi.fn();
    render(<ImportWizard open onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Import' }));
    expect(imp).toHaveBeenCalled();
    await waitFor(() => screen.getByText('Import complete.'));
    fireEvent.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });
});
