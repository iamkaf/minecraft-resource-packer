import React from 'react';

interface ModalProps {
  open?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({
  open = false,
  children,
  className = '',
}: ModalProps) {
  if (!open) return null;
  return (
    <dialog className="modal modal-open" data-testid="daisy-modal">
      <div className={`modal-box ${className}`.trim()}>{children}</div>
    </dialog>
  );
}
