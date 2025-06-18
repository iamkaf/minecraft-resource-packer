import React, { Suspense, lazy, useEffect, useState } from 'react';
import path from 'path';
import { useToast } from '../providers/ToastProvider';
import { Skeleton } from '../daisy/feedback';
import { useProject } from '../providers/ProjectProvider';
import RevisionsModal from '../modals/RevisionsModal';
import AssetInfoHeader from './AssetInfoHeader';
import TextPanel from './assetInfo/TextPanel';
import PngPanel from './assetInfo/PngPanel';
import AudioPanel from './assetInfo/AudioPanel';

const TextureDiff = lazy(() => import('./TextureDiff'));
const AudioPreview = lazy(() => import('./AudioPreview'));

interface Props {
  asset: string | null;
  count?: number;
}

export default function AssetInfo({ asset, count = 1 }: Props) {
  const { path: projectPath } = useProject();
  const toast = useToast();
  const [text, setText] = useState('');
  const [orig, setOrig] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [diff, setDiff] = useState(false);
  const [audio, setAudio] = useState(false);
  const [stamp, setStamp] = useState<number>();
  const [revs, setRevs] = useState(false);

  const full = asset ? path.join(projectPath, asset) : '';

  useEffect(() => {
    if (!asset) return;
    const listener = (_e: unknown, args: { path: string; stamp: number }) => {
      if (args.path === asset) setStamp(args.stamp);
    };
    window.electronAPI?.onFileChanged(listener);
    setStamp(undefined);
  }, [asset]);

  const isText = asset
    ? ['.txt', '.json', '.mcmeta'].includes(path.extname(asset).toLowerCase())
    : false;
  const isJson = asset
    ? ['.json', '.mcmeta'].includes(path.extname(asset).toLowerCase())
    : false;
  const isPng = asset ? path.extname(asset).toLowerCase() === '.png' : false;
  const isAudio = asset
    ? ['.ogg', '.wav'].includes(path.extname(asset).toLowerCase())
    : false;

  useEffect(() => {
    if (asset && count === 1 && isText) {
      window.electronAPI?.readFile(full).then((data) => {
        setOrig(data ?? '');
        setText(data ?? '');
      });
    } else {
      setOrig('');
      setText('');
    }
  }, [asset, count, full, isText]);

  const handleSave = () => {
    if (!asset) return;
    if (isJson) {
      try {
        JSON.parse(text);
      } catch {
        setError('Invalid JSON');
        toast({ message: 'Invalid JSON', type: 'error' });
        return;
      }
    }
    setError(null);
    window.electronAPI
      ?.saveRevision(projectPath, asset, text)
      .then(() => {
        setOrig(text);
        toast({ message: 'File saved', type: 'success' });
      })
      .catch(() => toast({ message: 'Save failed', type: 'error' }));
  };

  const handleReset = () => setText(orig);

  if (!asset) return <div>No asset selected</div>;
  return (
    <div className="p-2" data-testid="asset-info">
      <AssetInfoHeader
        asset={asset}
        count={count}
        isText={isText}
        isPng={isPng}
        isAudio={isAudio}
        stamp={stamp}
        onSave={handleSave}
        onReset={handleReset}
        onOpenDiff={() => setDiff(true)}
        onOpenAudio={() => setAudio(true)}
        onOpenRevisions={() => setRevs(true)}
        onOpenExternal={() =>
          window.electronAPI?.openExternalEditor(full).catch(() =>
            toast({
              message: 'Failed to open external editor',
              type: 'error',
            })
          )
        }
      />
      {count === 1 && isText && (
        <TextPanel
          text={text}
          setText={setText}
          error={error}
          isJson={isJson}
        />
      )}
      {isPng && count === 1 && <PngPanel />}
      {isAudio && count === 1 && <AudioPanel />}
      {diff && (
        <Suspense fallback={<Skeleton width="100%" height="8rem" />}>
          <TextureDiff asset={asset} onClose={() => setDiff(false)} />
        </Suspense>
      )}
      {audio && (
        <Suspense fallback={<Skeleton width="100%" height="8rem" />}>
          <AudioPreview asset={asset} onClose={() => setAudio(false)} />
        </Suspense>
      )}
      {revs && <RevisionsModal asset={asset} onClose={() => setRevs(false)} />}
    </div>
  );
}
