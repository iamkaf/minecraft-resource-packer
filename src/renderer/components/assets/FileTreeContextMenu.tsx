import React from 'react';
import path from 'path';
import AssetContextMenu from '../file/AssetContextMenu';
import { useAppStore } from '../../store';

interface Props {
  file: string;
  position: { x: number; y: number };
  firstItemRef?: React.Ref<HTMLButtonElement>;
}

export default function FileTreeContextMenu({ file, position, firstItemRef }: Props) {
  const projectPath = useAppStore((s) => s.projectPath)!;
  const selected = useAppStore((s) => s.selectedAssets);
  const noExport = useAppStore((s) => s.noExport);
  const toggleNoExport = useAppStore((s) => s.toggleNoExport);
  const deleteFiles = useAppStore((s) => s.deleteFiles);
  const openRename = useAppStore((s) => s.openRename);
  const openMove = useAppStore((s) => s.openMove);

  const filePath = path.join(projectPath, file);
  const list = selected.includes(file) ? selected : [file];
  const noExportChecked = list.every((x) => noExport.has(x));

  return (
    <AssetContextMenu
      filePath={filePath}
      selectionCount={selected.length}
      noExportChecked={noExportChecked}
      style={{ left: position.x, top: position.y, display: 'block' }}
      firstItemRef={firstItemRef}
      onReveal={(f) => window.electronAPI?.openInFolder(f)}
      onOpen={(f) => window.electronAPI?.openFile(f)}
      onRename={() => openRename(file)}
      onMove={() => openMove(file)}
      onDelete={() =>
        deleteFiles(
          selected.length > 1
            ? selected.map((s) => path.join(projectPath, s))
            : [filePath]
        )
      }
      onToggleNoExport={(flag) => {
        toggleNoExport(list, flag);
      }}
    />
  );
}
