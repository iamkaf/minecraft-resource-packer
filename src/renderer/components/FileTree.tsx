import React from 'react';
import { Tree } from 'react-arborist';
import path from 'path';
import { buildTree, TreeItem } from '../utils/tree';

interface Props {
  files: string[];
  selected: Set<string>;
  setSelected: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export default function FileTree({ files, selected, setSelected }: Props) {
  const data = React.useMemo<TreeItem[]>(() => buildTree(files), [files]);
  const handleSelect = (id: string) => {
    setSelected(new Set([id]));
  };
  return (
    <div
      style={{ height: '12rem' }}
      className="overflow-y-auto"
      data-testid="file-tree"
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
            className={`cursor-pointer pl-1 ${selected.has(node.id) ? 'bg-base-300' : ''}`}
            onClick={() => node.isLeaf && handleSelect(node.id)}
          >
            {node.isLeaf ? path.basename(node.data.name) : node.data.name}
          </div>
        )}
      </Tree>
    </div>
  );
}
