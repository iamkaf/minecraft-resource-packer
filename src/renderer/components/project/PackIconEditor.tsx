import React, { useState } from 'react';
import path from 'path';
import { Modal, Button } from '../daisy/actions';
import { InputField, FileInput } from '../daisy/input';

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
    <Modal open>
      <form className="flex flex-col gap-2" onSubmit={save}>
        <h3 className="font-bold text-lg">Pack Icon</h3>
        <label className="flex items-center gap-2">
          Border
          <InputField
            type="color"
            value={border}
            data-testid="border-input"
            onChange={(e) => setBorder(e.target.value)}
          />
        </label>
        <FileInput
          accept="image/png"
          data-testid="file-input"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        />
        <div className="modal-action">
          <Button
            type="button"
            onClick={() => window.electronAPI?.randomizeIcon(project)}
          >
            Randomise
          </Button>
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="btn-primary">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
