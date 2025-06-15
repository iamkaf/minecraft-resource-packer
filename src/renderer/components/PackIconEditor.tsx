import React, { useState } from 'react';

export default function PackIconEditor({
  project,
  onClose,
}: {
  project: string;
  onClose: () => void;
}) {
  const [border, setBorder] = useState('#000000');
  const [file, setFile] = useState<File | null>(null);

  return (
    <dialog className="modal modal-open" data-testid="icon-editor">
      <form
        data-testid="icon-form"
        className="modal-box flex flex-col gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          let data: string | undefined;
          if (file) {
            const buf = await file.arrayBuffer();
            data = Buffer.from(buf).toString('base64');
          }
          await window.electronAPI?.setPackIcon(project, {
            borderColor: border,
            data,
          });
          onClose();
        }}
      >
        <h3 className="font-bold text-lg">Pack Icon Editor</h3>
        <input
          aria-label="Border Colour"
          type="color"
          className="input input-bordered"
          value={border}
          onChange={(e) => setBorder(e.target.value)}
        />
        <input
          aria-label="Upload PNG"
          type="file"
          accept="image/png"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-secondary flex-1"
            onClick={() => window.electronAPI?.randomizeIcon(project, border)}
          >
            Randomise Item
          </button>
          <button
            type="button"
            className="btn btn-secondary flex-1"
            onClick={() => window.electronAPI?.randomizeIcon(project, border)}
          >
            Randomise Background
          </button>
        </div>
        <div className="modal-action">
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
