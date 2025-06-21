import React from 'react';
import { buildTree, TreeItem } from '../../utils/tree';
import FileTreeView from './FileTreeView';

interface Props {
  files: string[];
  versions: Record<string, number>;
}

export default function FileTree({ files, versions }: Props) {
  const data = React.useMemo<TreeItem[]>(() => buildTree(files), [files]);
  return <FileTreeView files={files} data={data} versions={versions} />;
}
