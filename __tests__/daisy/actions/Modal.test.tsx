import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../../../src/renderer/components/daisy/actions/Modal';

describe('daisy Modal', () => {
  it('renders modal when open and uses custom test id', () => {
    render(
      <Modal open testId="custom">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByTestId('custom')).toBeInTheDocument();
    const root = document.getElementById('overlay-root');
    expect(root?.querySelector('dialog')).toBeInTheDocument();
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
