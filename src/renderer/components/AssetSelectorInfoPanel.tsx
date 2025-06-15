import React from 'react';
import TextureThumb from './TextureThumb';

interface Props {
  projectPath: string;
  asset: string | null;
}

export default function AssetSelectorInfoPanel({ projectPath, asset }: Props) {
  if (!asset) return <div className="p-2">No asset selected</div>;
  return (
    <div className="p-2" data-testid="selector-info">
      <TextureThumb texture={asset} protocol="texture" alt={asset} size={64} />
      <p className="break-all text-sm">{asset}</p>
      <button
        className="btn btn-primary btn-sm mt-2"
        onClick={() => window.electronAPI?.addTexture(projectPath, asset)}
      >
        Add
      </button>
    </div>
  );
}
