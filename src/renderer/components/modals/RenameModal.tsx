import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button } from '../daisy/actions';
import { InputField } from '../daisy/input';

export default function RenameModal({
  current,
  onCancel,
  onRename,
  title = 'Rename File',
  confirmText = 'Save',
}: {
  current: string;
  onCancel: () => void;
  onRename: (newName: string) => void;
  title?: string;
  confirmText?: string;
}) {
  const [name, setName] = useState(current);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <Modal open onClose={onCancel}>
      <form
        ref={formRef}
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onRename(name);
        }}
      >
        <h3 className="font-bold text-lg">{title}</h3>
        <InputField
          ref={inputRef}
          className="input-bordered"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
