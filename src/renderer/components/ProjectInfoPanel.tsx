import React, { useEffect, useState } from 'react';
import path from 'path';
import type { PackMeta } from '../..//main/projects';

interface Props {
  projectPath: string;
  onExport: () => void;
}

export default function ProjectInfoPanel({ projectPath, onExport }: Props) {
  const [meta, setMeta] = useState<PackMeta | null>(null);

  useEffect(() => {
    const name = path.basename(projectPath);
    window.electronAPI?.loadPackMeta?.(name).then(setMeta);
  }, [projectPath]);

  const icon = `ptex://pack.png`;

  return (
    <div className="p-4 space-y-2" data-testid="project-info">
      <img
        src={icon}
        alt="Pack icon"
        className="w-16 h-16"
        style={{ imageRendering: 'pixelated' }}
      />
      <h1 className="font-display text-lg break-all">Project: {projectPath}</h1>
      <p className="text-sm min-h-[2rem]">{meta?.description}</p>
      <button className="btn btn-accent btn-sm" onClick={onExport}>
        Export Pack
      </button>
    </div>
  );
}
