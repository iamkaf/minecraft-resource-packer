import React, { Suspense, lazy } from 'react';
import { Oval } from 'react-loader-spinner';

const PreviewPane = lazy(() => import('./PreviewPane'));

export default function AssetInfo({ asset }: { asset: string | null }) {
  if (!asset) return <div>No asset selected</div>;
  return (
    <div className="p-2 flex gap-2" data-testid="asset-info">
      <Suspense
        fallback={
          <div className="flex items-center justify-center w-32 h-32">
            <Oval height={32} width={32} color="#3b82f6" />
          </div>
        }
      >
        <PreviewPane texture={asset} />
      </Suspense>
      <div>
        <h3 className="font-bold mb-1">{asset}</h3>
      </div>
    </div>
  );
}
