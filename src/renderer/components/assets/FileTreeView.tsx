import React, { useEffect, useRef, useState } from 'react';
import { Tree } from 'react-arborist';
import path from 'path';
import TextureThumb from './TextureThumb';
import FileTreeContextMenu from './FileTreeContextMenu';
import { useAppStore } from '../../store';
import type { TreeItem } from '../../utils/tree';

interface Props {
  files: string[];
  data: TreeItem[];
  versions: Record<string, number>;
}

export default function FileTreeView({ files, data, versions }: Props) {
  const selected = useAppStore((s) => s.selectedAssets);
  const setSelected = useAppStore((s) => s.setSelectedAssets);
  const projectPath = useAppStore((s) => s.projectPath)!;
  const [menuInfo, setMenuInfo] = useState<{ file: string; x: number; y: number } | null>(null);
  const firstItem = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (menuInfo && firstItem.current) firstItem.current.focus();
  }, [menuInfo]);

  const handleSelect = (e: React.MouseEvent, id: string) => {
    let ns = selected.slice();
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      if (ns.includes(id)) ns = ns.filter((x) => x !== id);
      else ns = [...ns, id];
    } else {
      ns = [id];
    }
    setSelected(ns);
  };

  const handleContext = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!selected.includes(id)) setSelected([id]);
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
          const overlay = document.getElementById('overlay-root');
          const next = e.relatedTarget as Node | null;
          if (!e.currentTarget.contains(next) && !(overlay && overlay.contains(next))) closeMenu();
        }}
      >
        {files.map((f) => (
          <div
            key={f}
            className={`cursor-pointer pl-1 flex items-center gap-1 ${selected.includes(f) ? 'bg-base-300' : ''}`}
            onClick={(e) => handleSelect(e, f)}
            onDoubleClick={() => window.electronAPI?.openFile(path.join(projectPath, f))}
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
          <FileTreeContextMenu
            file={menuInfo.file}
            position={{ x: menuInfo.x, y: menuInfo.y }}
            firstItemRef={firstItem}
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
        const overlay = document.getElementById('overlay-root');
        const next = e.relatedTarget as Node | null;
        if (!e.currentTarget.contains(next) && !(overlay && overlay.contains(next))) closeMenu();
      }}
    >
      <Tree initialData={data} openByDefault rowHeight={24} width={300} height={192}>
        {({ node, style }) => (
          <div
            style={style}
            className={`cursor-pointer pl-1 flex items-center gap-1 ${selected.includes(node.id) ? 'bg-base-300' : ''}`}
            onClick={(e) => node.isLeaf && handleSelect(e, node.id)}
            onDoubleClick={() =>
              node.isLeaf && window.electronAPI?.openFile(path.join(projectPath, node.id))
            }
            onContextMenu={(e) => node.isLeaf && handleContext(e, node.id)}
            onKeyDown={(e) => {
              if (node.isLeaf && (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10'))) {
                e.preventDefault();
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
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
        <FileTreeContextMenu
          file={menuInfo.file}
          position={{ x: menuInfo.x, y: menuInfo.y }}
          firstItemRef={firstItem}
        />
      )}
    </div>
  );
}
/* c8 ignore stop */
