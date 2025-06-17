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
});
