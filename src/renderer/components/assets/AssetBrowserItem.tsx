import React, { useEffect, useRef, useState } from 'react';
import path from 'path';
import { formatTextureName } from '../../utils/textureNames';
import AssetContextMenu from '../file/AssetContextMenu';
import TextureThumb from './TextureThumb';
import { useAppStore } from '../../store';

interface Props {
  projectPath: string;
  file: string;
  zoom: number;
  stamp?: number;
}

const AssetBrowserItem: React.FC<Props> = ({
  projectPath,
  file,
  zoom,
  stamp,
}) => {
  const selected = useAppStore((s) => s.selectedAssets);
  const setSelected = useAppStore((s) => s.setSelectedAssets);
  const noExport = useAppStore((s) => s.noExport);
  const toggleNoExport = useAppStore((s) => s.toggleNoExport);
  const deleteFiles = useAppStore((s) => s.deleteFiles);
  const openRename = useAppStore((s) => s.openRename);
  const openMove = useAppStore((s) => s.openMove);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const firstItem = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (menuPos && firstItem.current) {
      firstItem.current.focus();
    }
  }, [menuPos]);

  const full = path.join(projectPath, file);
  const name = path.basename(file);
  const formatted = file.endsWith('.png') ? formatTextureName(name) : name;
  const texPath = file.endsWith('.png') ? file : null;
  const altText = texPath ? formatted : name;

  const isSelected = selected.includes(file);

  const toggleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    let ns = selected.slice();
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      if (ns.includes(file)) ns = ns.filter((x) => x !== file);
      else ns = [...ns, file];
    } else {
      ns = [file];
    }
    setSelected(ns);
  };

  const showMenu = (x: number, y: number) => {
    setMenuPos({ x, y });
  };

  const handleContext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selected.includes(file)) {
      setSelected([file]);
    }
    showMenu(e.clientX, e.clientY);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
      e.preventDefault();
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      showMenu(rect.right, rect.bottom);
    }
  };

  const closeMenu = () => setMenuPos(null);

  return (
    <div
      className={`card card-compact cursor-pointer hover:ring ring-accent relative text-center tooltip ${
        isSelected ? 'ring' : ''
      } ${noExport.has(file) ? 'border border-gray-400' : ''}`}
      data-tip={`${formatted} \n${name}`}
      tabIndex={0}
      onClick={toggleSelect}
      onDoubleClick={() => window.electronAPI?.openFile(full)}
      onContextMenu={handleContext}
      onKeyDown={handleKey}
      onBlur={(e) => {
        const overlay = document.getElementById('overlay-root');
        const next = e.relatedTarget as Node | null;
        if (
          !e.currentTarget.contains(next) &&
          !(overlay && overlay.contains(next))
        ) {
          closeMenu();
        }
      }}
    >
      <figure className={noExport.has(file) ? 'opacity-50' : ''}>
        <TextureThumb
          texture={texPath}
          alt={altText}
          size={zoom}
          simplified
          stamp={stamp}
        />
      </figure>
      <div className="card-body p-1">
        <div className="text-xs leading-tight">
          <div className="truncate" style={{ width: zoom }}>
            {formatted}
          </div>
          <div className="opacity-50 truncate" style={{ width: zoom }}>
            {name}
          </div>
        </div>
      </div>
      <AssetContextMenu
        filePath={full}
        selectionCount={selected.length}
        noExportChecked={(() => {
          const list = selected.includes(file) ? selected : [file];
          return list.every((x) => noExport.has(x));
        })()}
        style={{
          left: menuPos?.x,
          top: menuPos?.y,
          display: menuPos ? 'block' : 'none',
        }}
        firstItemRef={firstItem}
        onReveal={() => window.electronAPI?.openInFolder(full)}
        onOpen={() => window.electronAPI?.openFile(full)}
        onRename={() => openRename(file)}
        onMove={() => openMove(file)}
        onDelete={() =>
          deleteFiles(
            selected.length > 1
              ? selected.map((s) => path.join(projectPath, s))
              : [full]
          )
        }
        onToggleNoExport={(flag) => {
          const list = selected.includes(file) ? selected : [file];
          toggleNoExport(list, flag);
        }}
      />
    </div>
  );
};

export default AssetBrowserItem;
