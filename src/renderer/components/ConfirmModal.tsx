import React from 'react';

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
    <dialog className="modal modal-open" data-testid="confirm-modal">
      <div className="modal-box">
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
      </div>
    </dialog>
  );
}
