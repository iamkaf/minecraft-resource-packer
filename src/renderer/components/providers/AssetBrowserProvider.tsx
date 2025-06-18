import React, { createContext, useContext, useEffect, useState } from 'react';
import path from 'path';
import RenameModal from '../modals/RenameModal';
import MoveFileModal from '../modals/MoveFileModal';
import { useProjectFiles } from '../file/useProjectFiles';
import { useProject } from './ProjectProvider';
import { useEditor } from '../editor/EditorContext';

interface AssetBrowserContextValue {
  selected: Set<string>;
  setSelected: React.Dispatch<React.SetStateAction<Set<string>>>;
  files: string[];
  versions: Record<string, number>;
  noExport: Set<string>;
  toggleNoExport: (files: string[], flag: boolean) => void;
  deleteFiles: (files: string[]) => void;
  openRename: (file: string) => void;
  openMove: (file: string) => void;
}

const noop = () => {
  /* noop */
};

const AssetBrowserContext = createContext<AssetBrowserContextValue>({
  selected: new Set<string>(),
  setSelected: () => {
    /* noop */
  },
  files: [],
  versions: {},
  noExport: new Set<string>(),
  toggleNoExport: noop,
  deleteFiles: noop,
  openRename: noop,
  openMove: noop,
});

export function useAssetBrowser() {
  return useContext(AssetBrowserContext);
}

interface ProviderProps {
  children: React.ReactNode;
}

export function AssetBrowserProvider({ children }: ProviderProps) {
  const { path: projectPath } = useProject();
  const { files, noExport, toggleNoExport, versions } = useProjectFiles();
  const { setSelected: setGlobalSelected } = useEditor();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const [moveTarget, setMoveTarget] = useState<string | null>(null);

  useEffect(() => {
    setGlobalSelected(Array.from(selected));
  }, [selected, setGlobalSelected]);

  const deleteFiles = (paths: string[]) => {
    paths.forEach((f) => window.electronAPI?.deleteFile(f));
    setSelected(new Set());
  };

  const openRename = (file: string) => setRenameTarget(file);

  const openMove = (file: string) => setMoveTarget(file);

  return (
    <AssetBrowserContext.Provider
      value={{
        selected,
        setSelected,
        files,
        versions,
        noExport,
        toggleNoExport,
        deleteFiles,
        openRename,
        openMove,
      }}
    >
      {children}
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
      {moveTarget && (
        <MoveFileModal
          current={moveTarget}
          onCancel={() => setMoveTarget(null)}
          onMove={(dest) => {
            const full = path.join(projectPath, moveTarget);
            const target = path.join(
              projectPath,
              dest,
              path.basename(moveTarget)
            );
            window.electronAPI?.renameFile(full, target);
            setMoveTarget(null);
          }}
        />
      )}
    </AssetBrowserContext.Provider>
  );
}

export { AssetBrowserContext };
