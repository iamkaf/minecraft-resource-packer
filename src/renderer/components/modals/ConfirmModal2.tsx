import React, { useEffect, useRef } from 'react';
import { Modal, Button } from '../daisy/actions';
import type { DaisyColor } from '../daisy/types';

export default function ConfirmModal2({
  title,
  message,
  confirmText = 'OK',
  variant = 'primary',
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  variant?: DaisyColor;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onConfirm]);

  return (
    <Modal open onClose={onCancel} variant={variant}>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <div>{message}</div>
      <div className="modal-action">
        <Button type="button" onClick={onCancel} variant="neutral">
          Cancel
        </Button>
        <Button ref={confirmRef} variant={variant} onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
