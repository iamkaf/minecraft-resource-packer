import React from 'react';

export default function AssetInfo({ asset }: { asset: string | null }) {
  if (!asset) return <div>No asset selected</div>;
  return (
    <div className="p-2" data-testid="asset-info">
      <h3 className="font-bold mb-1">{asset}</h3>
    </div>
  );
}
