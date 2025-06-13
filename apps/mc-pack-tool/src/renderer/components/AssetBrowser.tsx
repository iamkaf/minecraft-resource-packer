import React, { useEffect, useState, useRef } from 'react';
import { watch } from 'chokidar';
import fs from 'fs';
import path from 'path';

// Simple file list that updates whenever files inside the project directory
// change on disk. Uses chokidar to watch for edits and re-read the directory.

interface Props {
  path: string;
}

const AssetBrowser: React.FC<Props> = ({ path: projectPath }) => {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const loadFiles = () => {
      const out: string[] = [];
      const walk = (dir: string, prefix = '') => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const rel = path.join(prefix, entry.name);
          if (entry.isDirectory()) {
            walk(path.join(dir, entry.name), rel);
          } else {
            out.push(rel.split(path.sep).join('/'));
          }
        }
      };
      walk(projectPath);
      setFiles(out);
    };

    // Initial load and set up a watcher for future changes.
    loadFiles();
    const watcher = watch(projectPath, { ignoreInitial: true });
    watcher.on('all', loadFiles);
    return () => {
      void watcher.close();
    };
  }, [projectPath]);

  const [menuTarget, setMenuTarget] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const firstItem = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (menuTarget && firstItem.current) {
      firstItem.current.focus();
    }
  }, [menuTarget]);

  return (
    <div className="grid grid-cols-6 gap-2" onClick={() => setMenuTarget(null)}>
      {files.map((f) => {
        const full = path.join(projectPath, f);
        const name = path.basename(f);
        let thumb: string | null = null;
        if (f.endsWith('.png')) {
          const rel = f.split(path.sep).join('/');
          thumb = `ptex://${rel}`;
        }
        const openFolder = () => window.electronAPI?.openInFolder(full);
        const openFile = () => window.electronAPI?.openFile(full);
        const renameFile = () => {
          const newName = window.prompt('Rename file', name);
          if (!newName || newName === name) return;
          const target = path.join(path.dirname(full), newName);
          window.electronAPI?.renameFile(full, target);
        };
        const confirmDel = () => setConfirmDelete(full);
        const showMenu = () => setMenuTarget(f);
        const handleKey = (e: React.KeyboardEvent) => {
          if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
            e.preventDefault();
            showMenu();
          }
        };
        const menuOpen = menuTarget === f;
        return (
          <div
            key={f}
            className="p-1 cursor-pointer hover:ring ring-accent relative"
            tabIndex={0}
            onDoubleClick={openFile}
            onContextMenu={(e) => {
              e.preventDefault();
              showMenu();
            }}
            onKeyDown={handleKey}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setMenuTarget(null);
              }
            }}
          >
            {thumb ? (
              <img
                src={thumb}
                alt={name}
                className="w-full aspect-square"
                style={{ imageRendering: 'pixelated' }}
              />
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
                <button role="menuitem" onClick={renameFile}>
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
            <p>{path.basename(confirmDelete)}</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={() => {
                  if (!confirmDelete) return;
                  window.electronAPI?.deleteFile(confirmDelete);
                  setConfirmDelete(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};
export default AssetBrowser;
