import React, { useRef } from 'react';
import path from 'path';
import { useAppStore } from '../../store';
import AssetBrowserControls, { ControlsState } from './AssetBrowserControls';
import AssetCategorySection from './AssetCategorySection';
import FileTree from './FileTree';
import { groupFilesByCategory } from '../../utils/category';

interface Props {
  projectPath: string;
  files: string[];
  versions: Record<string, number>;
  zoom: number;
  onControlsChange: (state: ControlsState) => void;
}

const BrowserBody: React.FC<Props> = ({
  projectPath,
  files,
  versions,
  zoom,
  onControlsChange,
}) => {
  const selected = useAppStore((s) => s.selectedAssets);
  const deleteFiles = useAppStore((s) => s.deleteFiles);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleDeleteSelected = () => {
    deleteFiles(selected.map((s) => path.join(projectPath, s)));
  };

  const categories = React.useMemo(() => groupFilesByCategory(files), [files]);

  return (
    <div
      data-testid="asset-browser"
      ref={wrapperRef}
      className="h-full overflow-y-auto"
      onKeyDown={(e) => {
        if (e.key === 'Delete' && selected.length > 0) {
          e.preventDefault();
          handleDeleteSelected();
        }
      }}
      tabIndex={0}
    >
      <AssetBrowserControls onChange={onControlsChange} />
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          {(
            [
              'blocks',
              'items',
              'entity',
              'ui',
              'audio',
              'lang',
              'misc',
            ] as const
          ).map((key) => (
            <AssetCategorySection
              key={key}
              title={key}
              files={categories[key]}
              projectPath={projectPath}
              versions={versions}
              zoom={zoom}
            />
          ))}
        </div>
        <div>
          <FileTree files={files} versions={versions} />
        </div>
      </div>
    </div>
  );
};

export default BrowserBody;
