import React, { useState } from 'react';
import type { PackMeta } from '../../main/projects';

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
  const [license, setLicense] = useState(meta.license);
  const [authors, setAuthors] = useState(meta.authors.join('\n'));
  const [urls, setUrls] = useState(meta.urls.join('\n'));
  return (
    <dialog className="modal modal-open" data-testid="meta-modal">
      <form
        className="modal-box flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const authList = authors
            .split(/\n+/)
            .map((a: string) => a.trim())
            .filter((a: string) => a);
          if (!license.trim() || authList.length === 0) return;
          onSave({
            ...meta,
            description: desc,
            license,
            authors: authList,
            urls: urls
              .split(/\n+/)
              .map((u: string) => u.trim())
              .filter((u: string) => u),
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
          value={license}
          onChange={(e) => setLicense(e.target.value)}
          placeholder="License"
        />
        <textarea
          className="textarea textarea-bordered"
          value={authors}
          onChange={(e) => setAuthors(e.target.value)}
          placeholder="Authors (one per line)"
        />
        <textarea
          className="textarea textarea-bordered"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="URLs (one per line)"
        />
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.electronAPI?.randomizeIcon(project)}
          >
            Randomize Icon
          </button>
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
