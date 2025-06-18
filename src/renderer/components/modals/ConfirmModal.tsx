import React, { useEffect, useRef } from 'react';
import { Modal, Button } from '../daisy/actions';

export default function ConfirmModal({
  title,
  message,
  confirmText = 'OK',
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onCancel, onConfirm]);

  return (
    <Modal open>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <div>{message}</div>
      <div className="modal-action">
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button ref={confirmRef} className="btn-primary" onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
