import React from 'react';
import { Accordion } from '../daisy/display';
import AssetBrowserItem from './AssetBrowserItem';
import { Filter } from './AssetBrowserControls';

interface Props {
  title: Filter | 'misc';
  files: string[];
  projectPath: string;
  versions: Record<string, number>;
  zoom: number;
}

export default function AssetCategorySection({
  title,
  files,
  projectPath,
  versions,
  zoom,
}: Props) {
  if (files.length === 0) return null;
  return (
    <Accordion title={title} className="mb-2" defaultOpen>
      <div className="grid grid-cols-6 gap-2">
        {files.map((f) => (
          <AssetBrowserItem
            key={f}
            projectPath={projectPath}
            file={f}
            zoom={zoom}
            stamp={versions[f]}
          />
        ))}
      </div>
    </Accordion>
  );
}
