import React, { useState } from 'react';
import { PackMeta } from '../../main/projects';

export default function PackMetaModal({
  meta,
  onSave,
  onCancel,
}: {
  meta: PackMeta;
  onSave: (m: PackMeta) => void;
  onCancel: () => void;
}) {
  const [desc, setDesc] = useState(meta.description);
  const [author, setAuthor] = useState(meta.author);
  const [urls, setUrls] = useState(meta.urls.join('\n'));
  return (
    <dialog className="modal modal-open" data-testid="meta-modal">
      <form
        className="modal-box flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            ...meta,
            description: desc,
            author,
            urls: urls
              .split(/\n+/)
              .map((u) => u.trim())
              .filter((u) => u),
            updated: Date.now(),
          });
        }}
      >
        <h3 className="font-bold text-lg">Edit Metadata</h3>
        <textarea
          className="textarea textarea-bordered"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
        />
        <input
          className="input input-bordered"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author"
        />
        <textarea
          className="textarea textarea-bordered"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="URLs (one per line)"
        />
        <div className="modal-action">
          <button type="button" className="btn" onClick={onCancel}>
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
