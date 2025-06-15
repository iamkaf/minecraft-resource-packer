import React, { useEffect, useState } from 'react';
import path from 'path';
import type { PackMeta } from '../../main/projects';

interface Props {
  projectPath: string;
  onExport: () => void;
  onBack: () => void;
}

export default function ProjectInfoPanel({
  projectPath,
  onExport,
  onBack,
}: Props) {
  const [meta, setMeta] = useState<PackMeta | null>(null);
  const name = path.basename(projectPath);

  useEffect(() => {
    window.electronAPI?.loadPackMeta(name).then(setMeta);
  }, [name]);

  return (
    <div className="card bg-base-100 shadow flex-1" data-testid="project-info">
      <div className="card-body p-4 flex flex-col">
        <button className="link link-primary self-start" onClick={onBack}>
          Back to Projects
        </button>
        <figure className="mt-2">
          <img src="ptex://pack.png" alt="Pack icon" className="w-16 h-16" />
        </figure>
        <h2 className="card-title break-all">{name}</h2>
        <p className="text-xs break-all">{projectPath}</p>
        <p className="text-sm break-all flex-1">{meta?.description}</p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-sm"
            onClick={() => window.electronAPI?.openInFolder(projectPath)}
          >
            Open Folder
          </button>
          <button className="btn btn-accent btn-sm" onClick={onExport}>
            Export Pack
          </button>
        </div>
      </div>
    </div>
  );
}
