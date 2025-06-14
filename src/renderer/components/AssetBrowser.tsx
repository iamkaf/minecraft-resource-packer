import React, { useEffect, useState, useRef } from 'react';
import path from 'path';
import RenameModal from './RenameModal';
import { formatTextureName } from '../utils/textureNames';

// Simple file list that updates whenever files inside the project directory
// change on disk. Updates are received via the IPC file watcher service.

interface Props {
  path: string;
  onSelectionChange?: (sel: string[]) => void;
}

const AssetBrowser: React.FC<Props> = ({
  path: projectPath,
  onSelectionChange,
}) => {
  const [files, setFiles] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    onSelectionChange?.(Array.from(selected));
  }, [selected, onSelectionChange]);

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

  useEffect(() => {
    if (menuTarget && firstItem.current) {
      firstItem.current.focus();
    }
  }, [menuTarget]);

  const handleDeleteSelected = () => {
    setConfirmDelete(
      Array.from(selected).map((s) => path.join(projectPath, s))
    );
  };

  return (
    <div
      data-testid="asset-browser"
      className="grid grid-cols-6 gap-2"
      onClick={() => setMenuTarget(null)}
      onKeyDown={(e) => {
        if (e.key === 'Delete' && selected.size > 0) {
          e.preventDefault();
          handleDeleteSelected();
        }
      }}
      tabIndex={0}
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
        const confirmDel = () => setConfirmDelete([full]);
        const showMenu = () => setMenuTarget(f);
        const handleKey = (e: React.KeyboardEvent) => {
          if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
            e.preventDefault();
            showMenu();
          }
        };
        const menuOpen = menuTarget === f;
        const isSelected = selected.has(f);
        const toggleSelect = (e: React.MouseEvent) => {
          e.stopPropagation();
          const ns = new Set(selected);
          if (e.ctrlKey || e.metaKey || e.shiftKey) {
            if (ns.has(f)) ns.delete(f);
            else ns.add(f);
          } else {
            ns.clear();
            ns.add(f);
          }
          setSelected(ns);
        };
        const handleContext = (e: React.MouseEvent) => {
          e.preventDefault();
          if (!selected.has(f)) {
            setSelected(new Set([f]));
          }
          showMenu();
        };
        return (
          <div
            key={f}
            className={`p-1 cursor-pointer hover:ring ring-accent relative text-center tooltip ${
              isSelected ? 'ring' : ''
            }`}
            data-tip={`${formatted} \n${name}`}
            tabIndex={0}
            onClick={toggleSelect}
            onDoubleClick={openFile}
            onContextMenu={handleContext}
            onKeyDown={handleKey}
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
                <button
                  role="menuitem"
                  onClick={showRename}
                  disabled={selected.size > 1}
                >
                  Rename
                </button>
              </li>
              {selected.size > 1 ? (
                <li>
                  <button
                    role="menuitem"
                    onClick={() =>
                      setConfirmDelete(
                        Array.from(selected).map((s) =>
                          path.join(projectPath, s)
                        )
                      )
                    }
                  >
                    Delete Selected
                  </button>
                </li>
              ) : (
                <li>
                  <button role="menuitem" onClick={confirmDel}>
                    Delete
                  </button>
                </li>
              )}
            </ul>
          </div>
        );
      })}
      {confirmDelete && (
        <dialog className="modal modal-open" data-testid="delete-modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">Confirm Delete</h3>
            <p>
              {confirmDelete.length === 1
                ? path.basename(confirmDelete[0])
                : `${confirmDelete.length} files`}
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={() => {
                  if (!confirmDelete) return;
                  confirmDelete.forEach((full) =>
                    window.electronAPI?.deleteFile(full)
                  );
                  setConfirmDelete(null);
                  setSelected(new Set());
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
