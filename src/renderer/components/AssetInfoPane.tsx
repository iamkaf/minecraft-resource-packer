import React from 'react';

export default function AssetInfoPane({ selection }: { selection: string[] }) {
  if (selection.length === 0) {
    return <div className="p-2 bg-base-200">No asset selected</div>;
  }
  if (selection.length > 1) {
    return (
      <div className="p-2 bg-base-200">{selection.length} assets selected</div>
    );
  }
  return (
    <div className="p-2 bg-base-200 flex items-center gap-2">
      <span>Selected:</span>
      <span className="font-mono text-sm">{selection[0]}</span>
    </div>
  );
}
