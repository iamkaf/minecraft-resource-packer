import React from 'react';
import path from 'path';

interface Props {
  selected: string[];
}

export default function AssetInfoPane({ selected }: Props) {
  if (selected.length === 0) {
    return <div className="p-4">No asset selected</div>;
  }
  const first = selected[0];
  const base = path.basename(first);
  const rel = first.split(path.sep).join('/');
  const thumb = first.endsWith('.png') ? `ptex://${rel}` : null;
  return (
    <div className="p-4 bg-base-200" data-testid="asset-info">
      <h3 className="font-bold mb-2">Selected ({selected.length})</h3>
      <ul className="mb-2 text-sm">
        {selected.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      {thumb && (
        <img
          src={thumb}
          alt={base}
          className="w-32 aspect-square"
          style={{ imageRendering: 'pixelated' }}
        />
      )}
    </div>
  );
}
