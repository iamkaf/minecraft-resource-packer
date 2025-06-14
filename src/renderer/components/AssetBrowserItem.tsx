import React, { useEffect, useRef, useState } from 'react';
import path from 'path';
import { formatTextureName } from '../utils/textureNames';
import AssetContextMenu from './file/AssetContextMenu';

interface Props {
  projectPath: string;
  file: string;
  selected: Set<string>;
  setSelected: React.Dispatch<React.SetStateAction<Set<string>>>;
  noExport: Set<string>;
  toggleNoExport: (files: string[], flag: boolean) => void;
  confirmDelete: (files: string[]) => void;
  openRename: (file: string) => void;
}

const AssetBrowserItem: React.FC<Props> = ({
  projectPath,
  file,
  selected,
  setSelected,
  noExport,
  toggleNoExport,
  confirmDelete,
  openRename,
}) => {
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
  let thumb: string | null = null;
  if (file.endsWith('.png')) {
    const rel = file.split(path.sep).join('/');
    thumb = `ptex://${rel}`;
  }

  const isSelected = selected.has(file);

  const toggleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    const ns = new Set(selected);
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      if (ns.has(file)) ns.delete(file);
      else ns.add(file);
    } else {
      ns.clear();
      ns.add(file);
    }
    setSelected(ns);
  };

  const showMenu = (x: number, y: number) => {
    setMenuPos({ x, y });
  };

  const handleContext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selected.has(file)) {
      setSelected(new Set([file]));
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
      className={`p-1 cursor-pointer hover:ring ring-accent relative text-center tooltip ${
        isSelected ? 'ring' : ''
      } ${noExport.has(file) ? 'border border-gray-400' : ''}`}
      data-tip={`${formatted} \n${name}`}
      tabIndex={0}
      onClick={toggleSelect}
      onDoubleClick={() => window.electronAPI?.openFile(full)}
      onContextMenu={handleContext}
      onKeyDown={handleKey}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          closeMenu();
        }
      }}
    >
      <div className={noExport.has(file) ? 'opacity-50' : ''}>
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
      <AssetContextMenu
        filePath={full}
        selectionCount={selected.size}
        noExportChecked={(() => {
          const list = selected.has(file) ? Array.from(selected) : [file];
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
        onDelete={() =>
          confirmDelete(
            selected.size > 1
              ? Array.from(selected).map((s) => path.join(projectPath, s))
              : [full]
          )
        }
        onToggleNoExport={(flag) => {
          const list = selected.has(file) ? Array.from(selected) : [file];
          toggleNoExport(list, flag);
        }}
      />
    </div>
  );
};

export default AssetBrowserItem;
