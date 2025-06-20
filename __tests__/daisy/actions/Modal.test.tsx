import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Modal from '../../../src/renderer/components/daisy/actions/Modal';

describe('daisy Modal', () => {
  it('renders modal when open and uses custom test id', async () => {
    render(
      <Modal open testId="custom" variant="success" id="modal1">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByTestId('custom')).toBeInTheDocument();
    const root = document.getElementById('overlay-root');
    expect(root?.querySelector('dialog')).toBeInTheDocument();
    expect(root?.querySelector('dialog')).toHaveAttribute('id', 'modal1');
    await waitFor(() => expect(screen.getByTestId('custom')).toHaveFocus());
    const box = screen.getByTestId('custom').querySelector('.modal-box');
    expect(box).toHaveClass('bg-success');
  });

  it('calls onClose with Escape and backdrop click', () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose}>
        <p>Content</p>
      </Modal>
    );
    const dialog = screen.getByTestId('daisy-modal');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
    fireEvent.click(dialog);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
