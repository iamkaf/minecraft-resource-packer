import React, { useEffect, useRef, useState } from 'react';

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
  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);
  return (
    <dialog className="modal modal-open" data-testid="rename-modal">
      <form
        className="modal-box flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onRename(name);
        }}
      >
        <h3 className="font-bold text-lg">{title}</h3>
        <input
          ref={inputRef}
          className="input input-bordered"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="modal-action">
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {confirmText}
          </button>
        </div>
      </form>
    </dialog>
  );
}
