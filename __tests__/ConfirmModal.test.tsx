import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '../src/renderer/components/modals/ConfirmModal';

describe('ConfirmModal', () => {
  it('calls callbacks', () => {
    const cancel = vi.fn();
    const confirm = vi.fn();
    render(
      <ConfirmModal
        title="Delete"
        message="Are you sure?"
        onCancel={cancel}
        onConfirm={confirm}
      />
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(cancel).toHaveBeenCalled();
    fireEvent.click(screen.getByText('OK'));
    expect(confirm).toHaveBeenCalled();
  });

  it('focuses confirm and handles keys', () => {
    const cancel = vi.fn();
    const confirm = vi.fn();
    render(
      <ConfirmModal
        title="Delete"
        message="Are you sure?"
        onCancel={cancel}
        onConfirm={confirm}
      />
    );
    const confirmBtn = screen.getByText('OK');
    expect(confirmBtn).toHaveFocus();
    const dialog = screen.getByTestId('daisy-modal');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(cancel).toHaveBeenCalled();
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(confirm).toHaveBeenCalled();
  });
});
