import React, { useState } from 'react';
import path from 'path';

export default function PackIconEditor({
  project,
  onClose,
}: {
  project: string;
  onClose: () => void;
}) {
  const [border, setBorder] = useState('#000000');
  const [file, setFile] = useState<File | null>(null);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const src =
      (file as unknown as { path: string } | null)?.path ||
      path.join(project, 'pack.png');
    window.electronAPI?.savePackIcon(project, src, border).then(onClose);
  };

  return (
    <dialog className="modal modal-open" data-testid="icon-editor">
      <form className="modal-box flex flex-col gap-2" onSubmit={save}>
        <h3 className="font-bold text-lg">Pack Icon</h3>
        <label className="flex items-center gap-2">
          Border
          <input
            type="color"
            value={border}
            data-testid="border-input"
            onChange={(e) => setBorder(e.target.value)}
          />
        </label>
        <input
          type="file"
          accept="image/png"
          data-testid="file-input"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        />
        <div className="modal-action">
          <button
            type="button"
            className="btn"
            onClick={() => window.electronAPI?.randomizeIcon(project)}
          >
            Randomise
          </button>
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </dialog>
  );
}
