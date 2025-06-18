import React, { Suspense, lazy } from 'react';
import { Button } from '../daisy/actions';

const PreviewPane = lazy(() => import('./PreviewPane'));

interface Props {
  asset: string;
  count: number;
  isText: boolean;
  isPng: boolean;
  isAudio: boolean;
  stamp?: number;
  onSave?: () => void;
  onReset?: () => void;
  onOpenLab?: () => void;
  onOpenDiff?: () => void;
  onOpenAudio?: () => void;
  onOpenRevisions?: () => void;
  onOpenExternal?: () => void;
}

export default function AssetInfoHeader({
  asset,
  count,
  isText,
  isPng,
  isAudio,
  stamp,
  onSave,
  onReset,
  onOpenLab,
  onOpenDiff,
  onOpenAudio,
  onOpenRevisions,
  onOpenExternal,
}: Props) {
  return (
    <div className="flex gap-2 mb-2" data-testid="asset-info-header">
      <Suspense
        fallback={
          <div className="flex items-center justify-center w-32 h-32">
            <div
              className="skeleton w-32 h-32"
              data-testid="preview-skeleton"
            />
          </div>
        }
      >
        <PreviewPane texture={isPng ? asset : null} stamp={stamp} />
      </Suspense>
      <div className="flex-1 w-100">
        <h3 className="font-bold mb-1 break-all">{asset}</h3>
        {count === 1 && isText && (
          <div className="flex gap-2" data-testid="text-actions">
            <Button className="btn-primary btn-sm" onClick={onSave}>
              Save
            </Button>
            <Button className="btn-secondary btn-sm" onClick={onReset}>
              Reset
            </Button>
            <Button className="btn-secondary btn-sm" onClick={onOpenRevisions}>
              Revisions
            </Button>
          </div>
        )}
        {isPng && count === 1 && (
          <div className="flex flex-col gap-2 mt-2" data-testid="png-actions">
            <Button className="btn-secondary btn-sm" onClick={onOpenLab}>
              Open Texture Lab
            </Button>
            <Button className="btn-secondary btn-sm" onClick={onOpenExternal}>
              Edit Externally
            </Button>
            <Button className="btn-secondary btn-sm" onClick={onOpenDiff}>
              Compare with Vanilla
            </Button>
            <Button className="btn-secondary btn-sm" onClick={onOpenRevisions}>
              Revisions
            </Button>
          </div>
        )}
        {isAudio && count === 1 && (
          <div className="flex flex-col gap-2 mt-2" data-testid="audio-actions">
            <Button className="btn-secondary btn-sm" onClick={onOpenAudio}>
              Play Audio
            </Button>
            <Button className="btn-secondary btn-sm" onClick={onOpenRevisions}>
              Revisions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
