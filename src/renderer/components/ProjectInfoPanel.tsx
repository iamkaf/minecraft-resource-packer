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
    <div className="card bg-base-100 shadow" data-testid="project-info">
      <div className="card-body items-center gap-2 p-2">
        <button className="link link-primary self-start" onClick={onBack}>
          Back to Projects
        </button>
        <img src="ptex://pack.png" alt="Pack icon" className="w-16 h-16" />
        <h2 className="card-title text-lg font-display">{name}</h2>
        <p className="text-xs break-all">{projectPath}</p>
        <p className="text-sm text-center break-all flex-1">
          {meta?.description}
        </p>
        <div className="card-actions justify-end w-full mt-auto">
          <button
            className="btn btn-neutral btn-sm"
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
