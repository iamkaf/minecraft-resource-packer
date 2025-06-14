import React from 'react';

export default function AssetSelectorInfoPanel({
  asset,
}: {
  asset: string | null;
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
    </div>
  );
}
