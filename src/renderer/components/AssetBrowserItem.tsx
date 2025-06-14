import React, { useEffect, useRef, useState } from 'react';
import path from 'path';
import { formatTextureName } from '../utils/textureNames';

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
      } ${noExport.has(file) ? 'opacity-50 border border-gray-400' : ''}`}
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
      <ul
        className={`menu dropdown-content bg-base-200 rounded-box fixed z-10 w-40 p-1 shadow ${
          menuPos ? 'block' : 'hidden'
        }`}
        style={{ left: menuPos?.x, top: menuPos?.y }}
        role="menu"
      >
        <li>
          <button
            ref={firstItem}
            role="menuitem"
            onClick={() => window.electronAPI?.openInFolder(full)}
          >
            Reveal
          </button>
        </li>
        <li>
          <button
            role="menuitem"
            onClick={() => window.electronAPI?.openFile(full)}
          >
            Open
          </button>
        </li>
        <li>
          <button
            role="menuitem"
            onClick={() => openRename(file)}
            disabled={selected.size > 1}
          >
            Rename
          </button>
        </li>
        <li>
          <label className="flex gap-2 items-center cursor-pointer px-2">
            <span>No Export</span>
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={(() => {
                const list = selected.has(file) ? Array.from(selected) : [file];
                return list.every((x) => noExport.has(x));
              })()}
              onChange={(e) => {
                const list = selected.has(file) ? Array.from(selected) : [file];
                toggleNoExport(list, e.target.checked);
              }}
            />
          </label>
        </li>
        {selected.size > 1 ? (
          <li>
            <button
              role="menuitem"
              onClick={() =>
                confirmDelete(
                  Array.from(selected).map((s) => path.join(projectPath, s))
                )
              }
            >
              Delete Selected
            </button>
          </li>
        ) : (
          <li>
            <button role="menuitem" onClick={() => confirmDelete([full])}>
              Delete
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default AssetBrowserItem;
