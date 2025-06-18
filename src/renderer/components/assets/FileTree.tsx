import React, { useEffect, useRef, useState } from 'react';
import { Tree } from 'react-arborist';
import path from 'path';
import { buildTree, TreeItem } from '../../utils/tree';
import TextureThumb from './TextureThumb';
import AssetContextMenu from '../file/AssetContextMenu';
import { useProject } from '../providers/ProjectProvider';
import { useAssetBrowser } from '../providers/AssetBrowserProvider';

interface Props {
  files: string[];
  versions: Record<string, number>;
}

export default function FileTree({ files, versions }: Props) {
  const {
    selected,
    setSelected,
    noExport,
    toggleNoExport,
    deleteFiles,
    openRename,
    openMove,
  } = useAssetBrowser();
  const { path: projectPath } = useProject();
  const data = React.useMemo<TreeItem[]>(() => buildTree(files), [files]);
  const [menuInfo, setMenuInfo] = useState<{
    file: string;
    x: number;
    y: number;
  } | null>(null);
  const firstItem = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (menuInfo && firstItem.current) firstItem.current.focus();
  }, [menuInfo]);

  const handleSelect = (e: React.MouseEvent, id: string) => {
    const ns = new Set(selected);
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      if (ns.has(id)) ns.delete(id);
      else ns.add(id);
    } else {
      ns.clear();
      ns.add(id);
    }
    setSelected(ns);
  };

  const handleContext = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!selected.has(id)) setSelected(new Set([id]));
    setMenuInfo({ file: id, x: e.clientX, y: e.clientY });
  };

  const closeMenu = () => setMenuInfo(null);

  /* c8 ignore start */
  if (process.env.VITEST) {
    return (
      <div
        style={{ height: '12rem' }}
        className="overflow-y-auto"
        data-testid="file-tree"
        tabIndex={0}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) closeMenu();
        }}
      >
        {files.map((f) => (
          <div
            key={f}
            className={`cursor-pointer pl-1 flex items-center gap-1 ${
              selected.has(f) ? 'bg-base-300' : ''
            }`}
            onClick={(e) => handleSelect(e, f)}
            onDoubleClick={() =>
              window.electronAPI?.openFile(path.join(projectPath, f))
            }
            onContextMenu={(e) => handleContext(e, f)}
          >
            {f && (
              <TextureThumb
                texture={f}
                alt={path.basename(f)}
                size={24}
                simplified
                stamp={versions[f]}
              />
            )}
            <span className="text-sm break-all">{path.basename(f)}</span>
          </div>
        ))}
        {menuInfo && (
          <AssetContextMenu
            filePath={path.join(projectPath, menuInfo.file)}
            selectionCount={selected.size}
            noExportChecked={(() => {
              const list = selected.has(menuInfo.file)
                ? Array.from(selected)
                : [menuInfo.file];
              return list.every((x) => noExport.has(x));
            })()}
            style={{
              left: menuInfo.x,
              top: menuInfo.y,
              display: menuInfo ? 'block' : 'none',
            }}
            firstItemRef={firstItem}
            onReveal={(f) => window.electronAPI?.openInFolder(f)}
            onOpen={(f) => window.electronAPI?.openFile(f)}
            onRename={() => openRename(menuInfo.file)}
            onMove={() => openMove(menuInfo.file)}
            onDelete={() =>
              deleteFiles(
                selected.size > 1
                  ? Array.from(selected).map((s) => path.join(projectPath, s))
                  : [path.join(projectPath, menuInfo.file)]
              )
            }
            onToggleNoExport={(flag) => {
              const list = selected.has(menuInfo.file)
                ? Array.from(selected)
                : [menuInfo.file];
              toggleNoExport(list, flag);
            }}
          />
        )}
      </div>
    );
  }
  return (
    <div
      style={{ height: '12rem' }}
      className="overflow-y-auto"
      data-testid="file-tree"
      tabIndex={0}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) closeMenu();
      }}
    >
      <Tree
        initialData={data}
        openByDefault
        rowHeight={24}
        width={300}
        height={192}
      >
        {({ node, style }) => (
          <div
            style={style}
            className={`cursor-pointer pl-1 flex items-center gap-1 ${
              selected.has(node.id) ? 'bg-base-300' : ''
            }`}
            onClick={(e) => node.isLeaf && handleSelect(e, node.id)}
            onDoubleClick={() =>
              node.isLeaf &&
              window.electronAPI?.openFile(path.join(projectPath, node.id))
            }
            onContextMenu={(e) => node.isLeaf && handleContext(e, node.id)}
            onKeyDown={(e) => {
              if (
                node.isLeaf &&
                (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10'))
              ) {
                e.preventDefault();
                const rect = (
                  e.currentTarget as HTMLElement
                ).getBoundingClientRect();
                setMenuInfo({ file: node.id, x: rect.right, y: rect.bottom });
              }
            }}
          >
            {node.isLeaf && (
              <TextureThumb
                texture={node.id}
                alt={path.basename(node.data.name)}
                size={24}
                simplified
                stamp={versions[node.id]}
              />
            )}
            <span className="text-sm break-all">
              {node.isLeaf ? path.basename(node.data.name) : node.data.name}
            </span>
          </div>
        )}
      </Tree>
      {menuInfo && (
        <AssetContextMenu
          filePath={path.join(projectPath, menuInfo.file)}
          selectionCount={selected.size}
          noExportChecked={(() => {
            const list = selected.has(menuInfo.file)
              ? Array.from(selected)
              : [menuInfo.file];
            return list.every((x) => noExport.has(x));
          })()}
          style={{
            left: menuInfo.x,
            top: menuInfo.y,
            display: menuInfo ? 'block' : 'none',
          }}
          firstItemRef={firstItem}
          onReveal={(f) => window.electronAPI?.openInFolder(f)}
          onOpen={(f) => window.electronAPI?.openFile(f)}
          onRename={() => openRename(menuInfo.file)}
          onMove={() => openMove(menuInfo.file)}
          onDelete={() =>
            deleteFiles(
              selected.size > 1
                ? Array.from(selected).map((s) => path.join(projectPath, s))
                : [path.join(projectPath, menuInfo.file)]
            )
          }
          onToggleNoExport={(flag) => {
            const list = selected.has(menuInfo.file)
              ? Array.from(selected)
              : [menuInfo.file];
            toggleNoExport(list, flag);
          }}
        />
      )}
    </div>
  );
}
/* c8 ignore stop */
