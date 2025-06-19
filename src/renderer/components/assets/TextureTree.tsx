import React from 'react';
import { formatTextureName } from '../../utils/textureNames';
import { buildTree, TreeItem } from '../../utils/tree';
import type { TextureInfo } from './TextureGrid';

interface Props {
  textures: TextureInfo[];
  onSelect: (name: string) => void;
  onContextMenu?: (e: React.MouseEvent, name: string) => void;
  onKeyDown?: (e: React.KeyboardEvent, name: string) => void;
}

export default function TextureTree({
  textures,
  onSelect,
  onContextMenu,
  onKeyDown,
}: Props) {
  const data = React.useMemo<TreeItem[]>(
    () => buildTree(textures.map((t) => t.name)),
    [textures]
  );
  const urlMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    for (const t of textures) map[t.name] = t.url;
    return map;
  }, [textures]);

  const renderNode = (node: TreeItem) => {
    if (node.children && node.children.length > 0) {
      return (
        <li key={node.id}>
          <div className="font-semibold text-sm">{node.name}</div>
          <ul className="ml-4">
            {node.children.map((child) => renderNode(child))}
          </ul>
        </li>
      );
    }
    return (
      <li key={node.id}>
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => onSelect(node.id)}
          onContextMenu={(e) => onContextMenu?.(e, node.id)}
          onKeyDown={(e) =>
            (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) &&
            onKeyDown?.(e, node.id)
          }
          tabIndex={0}
        >
          <img
            src={urlMap[node.id]}
            alt={formatTextureName(node.id)}
            style={{ width: 24, height: 24, imageRendering: 'pixelated' }}
          />
          <span className="text-sm break-all">{node.name}</span>
        </div>
      </li>
    );
  };

  return (
    <div style={{ height: '12rem' }} className="overflow-y-auto">
      <ul data-testid="texture-tree" className="pl-1">
        {data.map((node) => renderNode(node))}
      </ul>
    </div>
  );
}
