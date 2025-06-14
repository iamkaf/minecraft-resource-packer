import React, { useEffect, useState } from 'react';
import path from 'path';
import type { PackMeta } from '../../main/projects';

interface Props {
  projectPath: string;
  onExport: () => void;
}

export default function ProjectInfoPanel({ projectPath, onExport }: Props) {
  const [meta, setMeta] = useState<PackMeta | null>(null);
  const name = path.basename(projectPath);

  useEffect(() => {
    window.electronAPI?.loadPackMeta(name).then(setMeta);
  }, [name]);

  return (
    <div
      className="p-2 flex flex-col items-center gap-2"
      data-testid="project-info"
    >
      <img src="ptex://pack.png" alt="Pack icon" className="w-16 h-16" />
      <h2 className="font-display text-lg">{name}</h2>
      <p className="text-sm text-center break-all flex-1">
        {meta?.description}
      </p>
      <button className="btn btn-accent btn-sm mt-auto" onClick={onExport}>
        Export Pack
      </button>
    </div>
  );
}
