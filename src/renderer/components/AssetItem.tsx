import React from 'react';
import path from 'path';
import { formatTextureName } from '../utils/textureNames';

interface Props {
  project: string;
  file: string;
  selected: boolean;
  onSelect: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onOpenMenu: () => void;
}

export default function AssetItem({
  project,
  file,
  selected,
  onSelect,
  onOpenMenu,
}: Props) {
  const full = path.join(project, file);
  const name = path.basename(file);
  const formatted = file.endsWith('.png') ? formatTextureName(name) : name;
  let thumb: string | null = null;
  if (file.endsWith('.png')) {
    const rel = file.split(path.sep).join('/');
    thumb = `ptex://${rel}`;
  }
  return (
    <div
      role="listitem"
      tabIndex={0}
      className={`p-1 cursor-pointer relative text-center tooltip ${
        selected ? 'ring ring-accent' : 'hover:ring ring-accent/50'
      }`}
      data-tip={`${formatted} \n${name}`}
      onClick={onSelect}
      onDoubleClick={() => window.electronAPI?.openFile(full)}
      onContextMenu={(e) => {
        e.preventDefault();
        onOpenMenu();
      }}
      onKeyDown={(e) => {
        if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
          e.preventDefault();
          onOpenMenu();
        }
        if (e.key === 'Enter') {
          window.electronAPI?.openFile(full);
        }
      }}
    >
      {thumb ? (
        <>
          <img
            src={thumb}
            alt={formatted}
            className="w-full aspect-square"
            style={{ imageRendering: 'pixelated' }}
          />
          <div className="text-xs leading-tight mt-1">
            <div>{formatted}</div>
            <div className="opacity-50">{name}</div>
          </div>
        </>
      ) : (
        <div className="w-full aspect-square bg-base-300 flex items-center justify-center">
          {name}
        </div>
      )}
    </div>
  );
}
