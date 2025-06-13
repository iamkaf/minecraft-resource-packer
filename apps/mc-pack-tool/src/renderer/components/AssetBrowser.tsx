import React, { useEffect, useState } from 'react';
import { watch } from 'chokidar';
import fs from 'fs';
import path from 'path';
import { Menu } from 'electron';
import { useToast } from './ToastProvider';

// Simple file list that updates whenever files inside the project directory
// change on disk. Uses chokidar to watch for edits and re-read the directory.

interface Props {
  path: string;
}

const AssetBrowser: React.FC<Props> = ({ path: projectPath }) => {
  const [files, setFiles] = useState<string[]>([]);
  const [renameTarget, setRenameTarget] = useState<{
    path: string;
    name: string;
  } | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{
    path: string;
    name: string;
  } | null>(null);
  const toast = useToast();

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

  return (
    <>
      <div className="grid grid-cols-6 gap-2">
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
            setRenameTarget({ path: full, name });
            setRenameValue(name);
          };
          const deleteFile = () => {
            setDeleteTarget({ path: full, name });
          };
          return (
            <div
              key={f}
              className="p-1 cursor-pointer hover:ring ring-accent"
              onDoubleClick={openFile}
              onContextMenu={(e) => {
                e.preventDefault();
                const menu = Menu.buildFromTemplate([
                  { label: 'Reveal', click: openFolder },
                  { label: 'Open', click: openFile },
                  { label: 'Rename', click: renameFile },
                  { label: 'Delete', click: deleteFile },
                ]);
                menu.popup();
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
            </div>
          );
        })}
      </div>
      {renameTarget && (
        <dialog className="modal modal-open" data-testid="rename-modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">Rename file</h3>
            <input
              autoFocus
              className="input input-bordered w-full"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
            />
            <div className="modal-action">
              <button className="btn" onClick={() => setRenameTarget(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const target = path.join(
                    path.dirname(renameTarget.path),
                    renameValue
                  );
                  window.electronAPI
                    ?.renameFile(renameTarget.path, target)
                    .then(() => toast('File renamed', 'success'));
                  setRenameTarget(null);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </dialog>
      )}
      {deleteTarget && (
        <dialog className="modal modal-open" data-testid="delete-modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">
              Delete {deleteTarget.name}?
            </h3>
            <div className="modal-action">
              <button className="btn" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={() => {
                  window.electronAPI
                    ?.deleteFile(deleteTarget.path)
                    .then(() => toast('File deleted', 'info'));
                  setDeleteTarget(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};
export default AssetBrowser;
