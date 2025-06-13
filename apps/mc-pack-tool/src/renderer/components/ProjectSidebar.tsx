import React, { useEffect, useState } from 'react';
import ExternalLink from './ExternalLink';
import PackMetaModal from './PackMetaModal';
import { PackMeta } from '../../main/projects';

export default function ProjectSidebar({
  project,
  open,
  onClose,
}: {
  project: string;
  open: boolean;
  onClose: () => void;
}) {
  const [meta, setMeta] = useState<PackMeta | null>(null);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (open) {
      window.electronAPI?.loadPackMeta(project).then(setMeta);
    }
  }, [open, project]);

  if (!open) return null;

  return (
    <div
      className={`drawer drawer-end ${open ? 'drawer-open' : ''}`}
      data-testid="project-sidebar"
    >
      <input
        type="checkbox"
        className="drawer-toggle"
        checked={open}
        onChange={onClose}
        data-testid="sidebar-toggle"
      />
      <div className="drawer-content" />
      <div className="drawer-side">
        <label className="drawer-overlay" onClick={onClose} />
        <aside className="p-4 w-80 bg-base-200">
          <h2 className="font-display text-lg mb-2">{project}</h2>
          {meta ? (
            <div className="card bg-base-100 p-4">
              <p>{meta.description}</p>
              <p className="text-sm mt-1">Author: {meta.author}</p>
              <ul className="list-disc list-inside mt-2">
                {meta.urls.map((u) => (
                  <li key={u}>
                    <ExternalLink href={u} className="link link-primary">
                      {u}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
              <p className="text-xs mt-2">
                Created: {new Date(meta.created).toLocaleDateString()}
              </p>
              {meta.updated && (
                <p className="text-xs">
                  Updated: {new Date(meta.updated).toLocaleDateString()}
                </p>
              )}
              <button
                className="btn btn-primary btn-sm mt-2"
                onClick={() => setEdit(true)}
              >
                Edit
              </button>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </aside>
      </div>
      {edit && meta && (
        <PackMetaModal
          meta={meta}
          onCancel={() => setEdit(false)}
          onSave={(m) => {
            window.electronAPI?.savePackMeta(project, m).then(() => {
              setMeta(m);
              setEdit(false);
            });
          }}
        />
      )}
    </div>
  );
}
