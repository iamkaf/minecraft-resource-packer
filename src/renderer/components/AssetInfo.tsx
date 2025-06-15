import React, { Suspense, lazy, useEffect, useState } from 'react';
import path from 'path';
import { Oval } from 'react-loader-spinner';
import { useToast } from './ToastProvider';
import Spinner from './Spinner';

const PreviewPane = lazy(() => import('./PreviewPane'));
const TextureLab = lazy(() => import('./TextureLab'));

interface Props {
  projectPath: string;
  asset: string | null;
  count?: number;
}

export default function AssetInfo({ projectPath, asset, count = 1 }: Props) {
  const toast = useToast();
  const [text, setText] = useState('');
  const [orig, setOrig] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [lab, setLab] = useState(false);

  const full = asset ? path.join(projectPath, asset) : '';

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
        toast('Invalid JSON', 'error');
        return;
      }
    }
    setError(null);
    window.electronAPI?.writeFile(full, text).then(() => {
      setOrig(text);
      toast('File saved', 'success');
    });
  };

  const handleReset = () => setText(orig);

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
      <div className="flex-1 max-w-md">
        <h3 className="font-bold mb-1 break-all">{asset}</h3>
        {count === 1 && isText && (
          <>
            <textarea
              className="textarea textarea-bordered w-full mb-2"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {error && <div className="text-error mb-1">{error}</div>}
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm" onClick={handleSave}>
                Save
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </>
        )}
        {isPng && count === 1 && (
          <div className="flex flex-col gap-2 mt-2">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setLab(true)}
            >
              Open Texture Lab
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => window.electronAPI?.openExternalEditor(full)}
            >
              Edit Externally
            </button>
          </div>
        )}
        {lab && (
          <Suspense fallback={<Spinner />}>
            <TextureLab
              file={full}
              projectPath={projectPath}
              onClose={() => setLab(false)}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
