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
  const [noExport, setNoExport] = useState<Set<string>>(new Set());
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);

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

  useEffect(() => {
    let active = true;
    window.electronAPI?.getNoExport(projectPath).then((list) => {
      if (active && list) setNoExport(new Set(list));
    });
    return () => {
      active = false;
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
      onClick={() => {
        setMenuTarget(null);
        setMenuPos(null);
      }}
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
        const showMenu = (x: number, y: number) => {
          setMenuPos({ x, y });
          setMenuTarget(f);
        };
        const handleKey = (e: React.KeyboardEvent) => {
          if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
            e.preventDefault();
            const rect = (
              e.currentTarget as HTMLElement
            ).getBoundingClientRect();
            showMenu(rect.right, rect.bottom);
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
          showMenu(e.clientX, e.clientY);
        };
        return (
          <div
            key={f}
            className={`p-1 cursor-pointer hover:ring ring-accent relative text-center tooltip ${
              isSelected ? 'ring' : ''
            } ${noExport.has(f) ? 'opacity-50 border border-gray-400' : ''}`}
            data-tip={`${formatted} \n${name}`}
            tabIndex={0}
            onClick={toggleSelect}
            onDoubleClick={openFile}
            onContextMenu={handleContext}
            onKeyDown={handleKey}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setMenuTarget(null);
                setMenuPos(null);
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
                menuOpen ? 'block' : 'hidden'
              }`}
              style={{ left: menuPos?.x, top: menuPos?.y }}
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
              <li>
                <label className="flex gap-2 items-center cursor-pointer px-2">
                  <span>No Export</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-sm"
                    checked={(() => {
                      const list = selected.has(f) ? Array.from(selected) : [f];
                      return list.every((x) => noExport.has(x));
                    })()}
                    onChange={(e) => {
                      const files = selected.has(f)
                        ? Array.from(selected)
                        : [f];
                      window.electronAPI?.setNoExport(
                        projectPath,
                        files,
                        e.target.checked
                      );
                      setNoExport((prev) => {
                        const ns = new Set(prev);
                        files.forEach((file) => {
                          if (e.target.checked) ns.add(file);
                          else ns.delete(file);
                        });
                        return ns;
                      });
                    }}
                  />
                </label>
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
