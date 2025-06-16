import React, { useState } from 'react';
import type { PackMeta } from '../../main/projects';
import { Modal, Button } from './daisy/actions';
import { InputField, Textarea } from './daisy/input';

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
  const [desc, setDesc] = useState(meta.description);
  const [author, setAuthor] = useState(meta.author);
  const [urls, setUrls] = useState(meta.urls.join('\n'));
  return (
    <Modal open>
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            ...meta,
            description: desc,
            author,
            urls: urls
              .split(/\n+/)
              .map((u: string) => u.trim())
              .filter((u: string) => u),
            updated: Date.now(),
          });
        }}
      >
        <h3 className="font-bold text-lg">Edit Metadata</h3>
        <Textarea
          className="textarea-bordered"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
        />
        <InputField
          className="input-bordered"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author"
        />
        <Textarea
          className="textarea-bordered"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="URLs (one per line)"
        />
        <div className="modal-action">
          <Button
            type="button"
            className="btn-secondary"
            onClick={() => window.electronAPI?.randomizeIcon(project)}
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
