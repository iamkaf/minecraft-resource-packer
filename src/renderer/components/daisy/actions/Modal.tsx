import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  open?: boolean;
  children: React.ReactNode;
  className?: string;
  testId?: string;
  onClose?: () => void;
}

export default function Modal({
  open = false,
  children,
  className = '',
  testId = 'daisy-modal',
  onClose,
}: ModalProps) {
  if (!open) return null;
  const root = document.getElementById('overlay-root');
  if (!root) return null;
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!onClose || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    const handleClick = (e: MouseEvent) => {
      if (e.target === dialog) {
        onClose();
      }
    };
    dialog.addEventListener('keydown', handleKey);
    dialog.addEventListener('click', handleClick);
    return () => {
      dialog.removeEventListener('keydown', handleKey);
      dialog.removeEventListener('click', handleClick);
    };
  }, [onClose]);
  return ReactDOM.createPortal(
    <dialog
      ref={dialogRef}
      open
      className="modal modal-open"
      data-testid={testId}
    >
      <div className={`modal-box ${className}`.trim()}>{children}</div>
    </dialog>,
    root
  );
}
