import React, { useEffect, useState, useRef } from 'react';
import path from 'path';
import RenameModal from './RenameModal';
import { formatTextureName } from '../utils/textureNames';

// Simple file list that updates whenever files inside the project directory
// change on disk. Updates are received via the IPC file watcher service.

interface Props {
  path: string;
  selected: string[];
  onSelectionChange: (sel: string[]) => void;
}

const AssetBrowser: React.FC<Props> = ({
  path: projectPath,
  selected,
  onSelectionChange,
}) => {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    window.electronAPI
      ?.watchProject(projectPath)
      .then((list) => {
        if (alive && list) setFiles(list);
      })
      .catch(() => {
        /* ignore */
      });
    const add = (_e: unknown, p: string) => setFiles((f) => [...f, p]);
    const remove = (_e: unknown, p: string) =>
      setFiles((f) => f.filter((x) => x !== p));
    const rename = (_e: unknown, args: { oldPath: string; newPath: string }) =>
      setFiles((f) => f.map((x) => (x === args.oldPath ? args.newPath : x)));
    window.electronAPI?.onFileAdded(add);
    window.electronAPI?.onFileRemoved(remove);
    window.electronAPI?.onFileRenamed(rename);
    return () => {
      alive = false;
      window.electronAPI?.unwatchProject(projectPath);
    };
  }, [projectPath]);

  const [menuTarget, setMenuTarget] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string[] | null>(null);
  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const firstItem = useRef<HTMLButtonElement>(null);
  const lastIndex = useRef<number>(-1);

  useEffect(() => {
    if (menuTarget && firstItem.current) {
      firstItem.current.focus();
    }
  }, [menuTarget]);

  const handleDelete = (filesToDel: string[]) => {
    setConfirmDelete(filesToDel);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete' && selected.length > 0) {
      e.preventDefault();
      handleDelete(selected);
    }
  };

  return (
    <div
      className="grid grid-cols-6 gap-2"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => {
        setMenuTarget(null);
        onSelectionChange([]);
      }}
    >
      {files.map((f) => {
        const full = path.join(projectPath, f);
        const name = path.basename(f);
        const formatted = f.endsWith('.png') ? formatTextureName(name) : name;
        let thumb: string | null = null;
        if (f.endsWith('.png')) {
          const rel = f.split(path.sep).join('/');
          thumb = `ptex://${rel}`;
        }
        const openFolder = () => window.electronAPI?.openInFolder(full);
        const openFile = () => window.electronAPI?.openFile(full);
        const showRename = () => setRenameTarget(f);
        const confirmDel = () =>
          handleDelete(selected.includes(f) ? selected : [f]);
        const showMenu = () => {
          if (!selected.includes(f)) onSelectionChange([f]);
          setMenuTarget(f);
        };
        const index = files.indexOf(f);
        const handleSelect = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (e.shiftKey && lastIndex.current !== -1) {
            const start = Math.min(lastIndex.current, index);
            const end = Math.max(lastIndex.current, index);
            const range = files.slice(start, end + 1);
            const set = new Set(selected);
            range.forEach((r) => set.add(r));
            onSelectionChange(Array.from(set));
          } else if (e.metaKey || e.ctrlKey) {
            const set = new Set(selected);
            if (set.has(f)) set.delete(f);
            else set.add(f);
            onSelectionChange(Array.from(set));
            lastIndex.current = index;
          } else {
            onSelectionChange([f]);
            lastIndex.current = index;
          }
        };
        const handleKey = (e: React.KeyboardEvent) => {
          if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
            e.preventDefault();
            showMenu();
          }
        };
        const menuOpen = menuTarget === f;
        const isSelected = selected.includes(f);
        return (
          <div
            key={f}
            className={`p-1 cursor-pointer hover:ring ring-accent relative text-center tooltip ${isSelected ? 'ring ring-primary' : ''}`}
            data-tip={`${formatted} \n${name}`}
            tabIndex={0}
            onDoubleClick={openFile}
            onContextMenu={(e) => {
              e.preventDefault();
              showMenu();
            }}
            onKeyDown={handleKey}
            onClick={handleSelect}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setMenuTarget(null);
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
              className={`menu dropdown-content bg-base-200 rounded-box absolute z-10 w-40 p-1 shadow ${
                menuOpen ? 'block' : 'hidden'
              }`}
              role="menu"
            >
              <li>
                <button ref={firstItem} role="menuitem" onClick={openFolder}>
                  Reveal
                </button>
              </li>
              <li>
                <button role="menuitem" onClick={openFile}>
                  Open
                </button>
              </li>
              <li>
                <button role="menuitem" onClick={showRename}>
                  Rename
                </button>
              </li>
              <li>
                <button role="menuitem" onClick={confirmDel}>
                  Delete
                </button>
              </li>
            </ul>
          </div>
        );
      })}
      {confirmDelete && (
        <dialog className="modal modal-open" data-testid="delete-modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">Confirm Delete</h3>
            <p>{confirmDelete.length} asset(s)</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={() => {
                  for (const f of confirmDelete) {
                    const full = path.join(projectPath, f);
                    window.electronAPI?.deleteFile(full);
                  }
                  setConfirmDelete(null);
                  onSelectionChange([]);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </dialog>
      )}
      {renameTarget && (
        <RenameModal
          current={path.basename(renameTarget)}
          onCancel={() => setRenameTarget(null)}
          onRename={(n) => {
            const full = path.join(projectPath, renameTarget);
            const target = path.join(path.dirname(full), n);
            window.electronAPI?.renameFile(full, target);
            setRenameTarget(null);
          }}
        />
      )}
    </div>
  );
};
export default AssetBrowser;
