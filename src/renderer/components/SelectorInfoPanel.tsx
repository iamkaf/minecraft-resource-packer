import React from 'react';
import PreviewPane from './PreviewPane';

export default function SelectorInfoPanel({ asset }: { asset: string | null }) {
  return (
    <div className="p-2" data-testid="selector-info">
      {asset ? (
        <>
          <PreviewPane texture={asset} protocol="texture" />
          <p className="mt-2 break-all text-sm">{asset}</p>
        </>
      ) : (
        <div>No asset selected</div>
      )}
    </div>
  );
}
