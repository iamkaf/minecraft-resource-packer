import React, { useEffect, useState, useRef } from 'react';
import path from 'path';
import RenameModal from './RenameModal';
import AssetItem from './AssetItem';

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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const firstItem = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (menuTarget && firstItem.current) {
      firstItem.current.focus();
    }
  }, [menuTarget]);

  useEffect(() => {
    setSelected(new Set());
  }, [projectPath]);

  useEffect(() => {
    onSelectionChange?.(Array.from(selected));
  }, [selected, onSelectionChange]);

  return (
    <div
      className="grid grid-cols-6 gap-2"
      onClick={() => setMenuTarget(null)}
      onKeyDown={(e) => {
        if (
          (e.key === 'Delete' || e.key === 'Backspace') &&
          selected.size > 0
        ) {
          setConfirmDelete(Array.from(selected));
        }
      }}
    >
      {files.map((f) => {
        const full = path.join(projectPath, f);
        const menuOpen = menuTarget === f;
        const handleSelect = (e: React.MouseEvent | React.KeyboardEvent) => {
          setMenuTarget(null);
          setSelected((cur) => {
            const next = new Set(cur);
            if (e.metaKey || e.ctrlKey) {
              if (next.has(f)) next.delete(f);
              else next.add(f);
            } else {
              next.clear();
              next.add(f);
            }
            return next;
          });
        };
        const showMenu = () => {
          if (!selected.has(f)) {
            setSelected(new Set([f]));
          }
          setMenuTarget(f);
        };
        const openFolder = () => window.electronAPI?.openInFolder(full);
        const openFile = () => window.electronAPI?.openFile(full);
        const showRename = () => setRenameTarget(f);
        const confirmDel = () => setConfirmDelete(Array.from(selected));

        return (
          <div key={f} className="relative">
            <AssetItem
              project={projectPath}
              file={f}
              selected={selected.has(f)}
              onSelect={handleSelect}
              onOpenMenu={showMenu}
            />
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
              {selected.size === 1 && (
                <li>
                  <button role="menuitem" onClick={showRename}>
                    Rename
                  </button>
                </li>
              )}
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
            <p>
              {confirmDelete.length === 1
                ? path.basename(confirmDelete[0])
                : `Delete ${confirmDelete.length} assets?`}
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={() => {
                  if (!confirmDelete) return;
                  confirmDelete.forEach((d) => {
                    const full = path.join(projectPath, d);
                    window.electronAPI?.deleteFile(full);
                  });
                  setSelected(new Set());
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
