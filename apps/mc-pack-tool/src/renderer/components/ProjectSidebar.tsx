import React, { useEffect, useState } from 'react';
import ExternalLink from './ExternalLink';
import PackMetaModal from './PackMetaModal';
import type { PackMeta } from '../../main/projects';

export default function ProjectSidebar({
  project,
}: {
  project: string | null;
}) {
  const [meta, setMeta] = useState<PackMeta | null>(null);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (project) {
      setMeta(null);
      window.electronAPI?.loadPackMeta(project).then(setMeta);
    }
  }, [project]);

  return (
    <aside data-testid="project-sidebar" className="w-80 p-4 bg-base-200">
      {project ? (
        <>
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
        </>
      ) : (
        <p>Select a project to view metadata.</p>
      )}
      {edit && meta && (
        <PackMetaModal
          project={project}
          meta={meta}
          onCancel={() => setEdit(false)}
          onSave={(m) => {
            if (!project) return;
            window.electronAPI?.savePackMeta(project, m).then(() => {
              setMeta(m);
              setEdit(false);
            });
          }}
        />
      )}
    </aside>
  );
}
