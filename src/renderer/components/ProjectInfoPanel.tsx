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
    <div className="p-4 overflow-y-auto" data-testid="project-info">
      <img
        src="ptex://pack.png"
        alt="Pack icon"
        className="w-24 h-24 mb-2"
        style={{ imageRendering: 'pixelated' }}
      />
      <h2 className="font-display text-lg break-all mb-1">{name}</h2>
      {meta && <p className="mb-2 break-words">{meta.description}</p>}
      <button className="btn btn-accent btn-sm" onClick={onExport}>
        Export Pack
      </button>
    </div>
  );
}
