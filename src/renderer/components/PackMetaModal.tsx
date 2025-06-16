import React, { useState } from 'react';
import path from 'path';
import { app } from 'electron';
import type { PackMeta } from '../../main/projects';
import { PackMetaSchema } from '../../shared/project';
import { Modal, Button } from './daisy/actions';
import JsonEditor from './JsonEditor';
import { useToast } from './ToastProvider';

export default function PackMetaModal({
  project,
  meta,
  onSave,
  onCancel,
}: {
  project: string;
  meta: PackMeta;
  onSave: (m: PackMeta) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState(JSON.stringify(meta, null, 2));
  const toast = useToast();
  return (
    <Modal open>
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            const obj = JSON.parse(text);
            const parsed = PackMetaSchema.parse(obj);
            onSave({ ...parsed, updated: Date.now() });
          } catch {
            toast({ message: 'Invalid metadata', type: 'error' });
          }
        }}
      >
        <h3 className="font-bold text-lg">Edit Metadata</h3>
        <JsonEditor value={text} onChange={setText} height="16rem" />
        <div className="modal-action">
          <Button
            type="button"
            className="btn-secondary"
            onClick={() =>
              window.electronAPI?.randomizeIcon(
                path.join(app.getPath('userData'), 'projects', project)
              )
            }
          >
            Randomize Icon
          </Button>
          <Button type="button" onClick={onCancel}>
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
