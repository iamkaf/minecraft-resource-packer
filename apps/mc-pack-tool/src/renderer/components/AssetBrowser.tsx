import React, { useEffect, useState, useRef } from 'react';
import RenameModal from './RenameModal';

// Simple file list that updates whenever files inside the project directory
// change on disk. Uses chokidar to watch for edits and re-read the directory.

interface Props {
  path: string;
}

const AssetBrowser: React.FC<Props> = ({ path: projectPath }) => {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    window.electronAPI?.listFiles(projectPath).then(setFiles);
  }, [projectPath]);

  const [menuTarget, setMenuTarget] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const firstItem = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (menuTarget && firstItem.current) {
      firstItem.current.focus();
    }
  }, [menuTarget]);

  return (
    <div className="grid grid-cols-6 gap-2" onClick={() => setMenuTarget(null)}>
      {files.map((f) => {
        const full = window.electronAPI?.pathJoin(projectPath, f) ?? '';
        const name = f.split('/').pop() ?? f;
        let thumb: string | null = null;
        if (f.endsWith('.png')) {
          thumb = `ptex://${f}`;
        }
        const openFolder = () => window.electronAPI?.openInFolder(full);
        const openFile = () => window.electronAPI?.openFile(full);
        const showRename = () => setRenameTarget(f);
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
            <p>{window.electronAPI?.pathBasename(confirmDelete)}</p>
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
      {renameTarget && (
        <RenameModal
          current={window.electronAPI?.pathBasename(renameTarget)}
          onCancel={() => setRenameTarget(null)}
          onRename={(n) => {
            const full =
              window.electronAPI?.pathJoin(projectPath, renameTarget) ?? '';
            const dir = window.electronAPI?.pathDirname(full) ?? '';
            const target = window.electronAPI?.pathJoin(dir, n) ?? '';
            window.electronAPI?.renameFile(full, target);
            setRenameTarget(null);
          }}
        />
      )}
    </div>
  );
};
export default AssetBrowser;
