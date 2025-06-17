import React, { useState } from 'react';
import path from 'path';
import { app } from 'electron';
import MonacoEditor from '@monaco-editor/react';
import { PackMetaSchema } from '../../shared/project';
import type { PackMeta } from '../../main/projects';
import { Modal, Button } from './daisy/actions';
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
  const toast = useToast();
  const [text, setText] = useState(JSON.stringify(meta, null, 2));
  const [version, setVersion] = useState(meta.version);
  return (
    <Modal open>
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            const data = JSON.parse(text);
            const parsed = PackMetaSchema.parse(data);
            onSave({ ...parsed, version, updated: Date.now() });
          } catch {
            toast({ message: 'Invalid metadata', type: 'error' });
          }
        }}
      >
        <h3 className="font-bold text-lg">Edit Metadata</h3>
        <label className="flex items-center gap-2">
          Version
          <input
            className="input input-bordered flex-1"
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          />
        </label>
        <MonacoEditor
          height="20rem"
          defaultLanguage="json"
          value={text}
          onChange={(v) => setText(v ?? '')}
          options={{ minimap: { enabled: false } }}
          theme="vs-dark"
        />
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
