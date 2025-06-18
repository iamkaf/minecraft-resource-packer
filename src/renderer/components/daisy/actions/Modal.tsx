import React from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  open?: boolean;
  children: React.ReactNode;
  className?: string;
  testId?: string;
}

export default function Modal({
  open = false,
  children,
  className = '',
  testId = 'daisy-modal',
}: ModalProps) {
  if (!open) return null;
  const root = document.getElementById('overlay-root');
  if (!root) return null;
  return ReactDOM.createPortal(
    <dialog open className="modal modal-open" data-testid={testId}>
      <div className={`modal-box ${className}`.trim()}>{children}</div>
    </dialog>,
    root
  );
}
