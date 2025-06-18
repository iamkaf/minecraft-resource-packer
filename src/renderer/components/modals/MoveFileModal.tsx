import React, { useEffect, useRef, useState } from 'react';
import path from 'path';
import { Modal, Button } from '../daisy/actions';
import { InputField } from '../daisy/input';

export default function MoveFileModal({
  current,
  onCancel,
  onMove,
  title = 'Move File',
  confirmText = 'Move',
}: {
  current: string;
  onCancel: () => void;
  onMove: (dest: string) => void;
  title?: string;
  confirmText?: string;
}) {
  const [dest, setDest] = useState(path.dirname(current));
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  return (
    <Modal open>
      <form
        ref={formRef}
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onMove(dest);
        }}
      >
        <h3 className="font-bold text-lg">{title}</h3>
        <InputField
          ref={inputRef}
          className="input-bordered"
          value={dest}
          onChange={(e) => setDest(e.target.value)}
        />
        <div className="modal-action">
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="btn-primary">
            {confirmText}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
