import React from 'react';
import { Modal } from './daisy/actions';

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
  return (
    <Modal open>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <div>{message}</div>
      <div className="modal-action">
        <button className="btn" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={onConfirm}>
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
