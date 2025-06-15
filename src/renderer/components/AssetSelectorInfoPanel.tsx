import React from 'react';

export default function AssetSelectorInfoPanel({
  asset,
  projectPath,
}: {
  asset: string | null;
  projectPath: string;
}) {
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
        Add to Project
      </button>
    </div>
  );
}
