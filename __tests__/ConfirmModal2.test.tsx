import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal2 from '../src/renderer/components/modals/ConfirmModal2';

describe('ConfirmModal2', () => {
  it('applies variant and calls callbacks', () => {
    const cancel = vi.fn();
    const confirm = vi.fn();
    render(
      <ConfirmModal2
        title="Alert"
        message="Proceed?"
        variant="error"
        onCancel={cancel}
        onConfirm={confirm}
      />
    );
    const modal = screen.getByTestId('daisy-modal');
    expect(modal.querySelector('.modal-box')).toHaveClass('bg-error');
    fireEvent.click(screen.getByText('Cancel'));
    expect(cancel).toHaveBeenCalled();
    fireEvent.click(screen.getByText('OK'));
    expect(confirm).toHaveBeenCalled();
  });
});
