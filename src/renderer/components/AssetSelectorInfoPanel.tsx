import React from 'react';

interface Props {
  projectPath: string;
  asset: string | null;
}

export default function AssetSelectorInfoPanel({ projectPath, asset }: Props) {
  if (!asset) return <div className="p-2">No asset selected</div>;
  return (
    <div className="p-2" data-testid="selector-info">
      <img
        src={`texture://${asset}`}
        alt={asset}
        className="w-16 h-16 mb-2"
        style={{ imageRendering: 'pixelated' }}
      />
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
