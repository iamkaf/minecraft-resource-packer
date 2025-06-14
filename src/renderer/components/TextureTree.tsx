import React from 'react';
import { Tree } from 'react-arborist';
import { formatTextureName } from '../utils/textureNames';
import { buildTree, TreeItem } from '../utils/tree';
import type { TextureInfo } from './TextureGrid';

interface Props {
  textures: TextureInfo[];
  onSelect: (name: string) => void;
}

export default function TextureTree({ textures, onSelect }: Props) {
  const data = React.useMemo<TreeItem[]>(
    () => buildTree(textures.map((t) => t.name)),
    [textures]
  );
  const urlMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    for (const t of textures) map[t.name] = t.url;
    return map;
  }, [textures]);

  return (
    <div style={{ height: '12rem' }} className="overflow-y-auto">
      <Tree
        initialData={data}
        openByDefault
        rowHeight={32}
        width={300}
        height={192}
      >
        {({ node, style }) => (
          <div
            style={style}
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => {
              if (node.isLeaf) onSelect(node.id);
            }}
          >
            {node.isLeaf && (
              <img
                src={urlMap[node.id]}
                alt={formatTextureName(node.id)}
                style={{ width: 24, height: 24, imageRendering: 'pixelated' }}
              />
            )}
            <span className="text-sm break-all">{node.data.name}</span>
          </div>
        )}
      </Tree>
    </div>
  );
}
