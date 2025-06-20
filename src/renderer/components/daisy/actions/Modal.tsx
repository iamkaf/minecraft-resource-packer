import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import type { DaisyColor } from '../types';

interface ModalProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
  open?: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: DaisyColor;
  testId?: string;
  onClose?: () => void;
}

export default function Modal({
  open = false,
  children,
  className = '',
  variant,
  testId = 'daisy-modal',
  onClose,
  ...rest
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
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);
  return ReactDOM.createPortal(
    <dialog
      ref={dialogRef}
      open
      tabIndex={-1}
      className="modal modal-open"
      data-testid={testId}
      {...rest}
    >
      <div
        className={`modal-box ${
          variant ? `bg-${variant} text-${variant}-content` : ''
        } ${className}`.trim()}
      >
        {children}
      </div>
    </dialog>,
    root
  );
}
