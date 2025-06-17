import React, { Suspense, lazy, useEffect, useState } from 'react';
import path from 'path';
import { useToast } from './ToastProvider';
import { Skeleton } from './daisy/feedback';
import MonacoEditor from '@monaco-editor/react';
import { Button } from './daisy/actions';
import { useProject } from './ProjectProvider';
import RevisionsModal from './RevisionsModal';

const PreviewPane = lazy(() => import('./PreviewPane'));
const TextureLab = lazy(() => import('./TextureLab'));
const TextureDiff = lazy(() => import('./TextureDiff'));

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
  const [lab, setLab] = useState(false);
  const [diff, setDiff] = useState(false);
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
    <div className="p-2 flex gap-2" data-testid="asset-info">
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
        <PreviewPane texture={asset} stamp={stamp} />
      </Suspense>
      <div className="flex-1 w-100">
        <h3 className="font-bold mb-1 break-all">{asset}</h3>
        {count === 1 && isText && (
          <>
            {error && <div className="text-error mb-1">{error}</div>}
            <div className="flex gap-2">
              <Button className="btn-primary btn-sm" onClick={handleSave}>
                Save
              </Button>
              <Button className="btn-secondary btn-sm" onClick={handleReset}>
                Reset
              </Button>
              <Button
                className="btn-secondary btn-sm"
                onClick={() => setRevs(true)}
              >
                Revisions
              </Button>
            </div>
            <div className="h-[14rem]">
              <MonacoEditor
                defaultLanguage={isJson ? 'json' : 'plaintext'}
                value={text}
                onChange={(v) => setText(v ?? '')}
                options={{ minimap: { enabled: false } }}
                theme="vs-dark"
              />
            </div>
          </>
        )}
        {isPng && count === 1 && (
          <div className="flex flex-col gap-2 mt-2">
            <Button
              className="btn-secondary btn-sm"
              onClick={() => setLab(true)}
            >
              Open Texture Lab
            </Button>
            <Button
              className="btn-secondary btn-sm"
              onClick={() =>
                window.electronAPI?.openExternalEditor(full).catch(() =>
                  toast({
                    message: 'Failed to open external editor',
                    type: 'error',
                  })
                )
              }
            >
              Edit Externally
            </Button>
            <Button
              className="btn-secondary btn-sm"
              onClick={() => setDiff(true)}
            >
              Compare with Vanilla
            </Button>
            <Button
              className="btn-secondary btn-sm"
              onClick={() => setRevs(true)}
            >
              Revisions
            </Button>
          </div>
        )}
        {lab && (
          <Suspense fallback={<Skeleton width="100%" height="8rem" />}>
            <TextureLab
              file={full}
              onClose={() => setLab(false)}
              stamp={stamp}
            />
          </Suspense>
        )}
        {diff && (
          <Suspense fallback={<Skeleton width="100%" height="8rem" />}>
            <TextureDiff asset={asset} onClose={() => setDiff(false)} />
          </Suspense>
        )}
        {revs && (
          <RevisionsModal asset={asset} onClose={() => setRevs(false)} />
        )}
      </div>
    </div>
  );
}
