import React from 'react';
import TextureThumb from './TextureThumb';
import { Button } from '../daisy/actions';
import { useAppStore } from '../../store';
import { useToast } from '../providers/ToastProvider';

interface Props {
  asset: string | null;
}

export default function AssetSelectorInfoPanel({ asset }: Props) {
  const projectPath = useAppStore((s) => s.projectPath)!;
  const toast = useToast();
  if (!asset) return <div className="p-2">No asset selected</div>;
  const handleAdd = () => {
    window.electronAPI?.addTexture(projectPath, asset);
    toast({ type: 'success', message: `Added ${asset}` });
  };
  return (
    <div className="p-2" data-testid="selector-info">
      <div className="flex items-center justify-center gap-2 mb-2">
        <TextureThumb
          texture={asset}
          protocol="vanilla"
          alt={asset}
          size={256}
        />
      </div>
      <p className="break-all text-lg text-center">{asset}</p>
      <Button className="btn-primary btn-xl btn-block mt-2" onClick={handleAdd}>
        Add
      </Button>
    </div>
  );
}
