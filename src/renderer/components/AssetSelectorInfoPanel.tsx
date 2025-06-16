import React from 'react';
import TextureThumb from './TextureThumb';
import { Button } from './daisy/actions';
import { useProject } from './ProjectProvider';

interface Props {
  asset: string | null;
}

export default function AssetSelectorInfoPanel({ asset }: Props) {
  const { path: projectPath } = useProject();
  if (!asset) return <div className="p-2">No asset selected</div>;
  return (
    <div className="p-2" data-testid="selector-info">
      <TextureThumb texture={asset} protocol="vanilla" alt={asset} size={64} />
      <p className="break-all text-sm">{asset}</p>
      <Button
        className="btn-primary btn-sm mt-2"
        onClick={() => window.electronAPI?.addTexture(projectPath, asset)}
      >
        Add
      </Button>
    </div>
  );
}
