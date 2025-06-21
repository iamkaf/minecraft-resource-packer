import React, { useRef, useState } from 'react';
import path from 'path';
import RenameModal from '../modals/RenameModal';
import MoveFileModal from '../modals/MoveFileModal';
import { useProjectFiles } from '../file/useProjectFiles';
import FileTree from './FileTree';
import { useAppStore } from '../../store';
import AssetBrowserControls, {
  Filter,
  ControlsState,
} from './AssetBrowserControls';
import AssetCategorySection from './AssetCategorySection';

const normalizeForCategory = (file: string) => {
  const texIdx = file.indexOf('textures/');
  if (texIdx >= 0) return file.slice(texIdx + 'textures/'.length);
  const soundIdx = file.indexOf('sounds/');
  if (soundIdx >= 0) return file.slice(soundIdx);
  const soundIdx2 = file.indexOf('sound/');
  if (soundIdx2 >= 0) return file.slice(soundIdx2);
  return file;
};

const getCategory = (name: string): Filter | 'misc' => {
  if (name.startsWith('block/')) return 'blocks';
  if (name.startsWith('item/')) return 'items';
  if (name.startsWith('entity/')) return 'entity';
  if (
    name.startsWith('gui/') ||
    name.startsWith('font/') ||
    name.startsWith('misc/')
  )
    return 'ui';
  if (name.startsWith('sound/') || name.startsWith('sounds/')) return 'audio';
  if (name.startsWith('lang/')) return 'lang';
  return 'misc';
};

const BrowserBody: React.FC<{
  projectPath: string;
  visible: string[];
  versions: Record<string, number>;
  zoom: number;
  onControlsChange: (state: ControlsState) => void;
  categories: Record<Filter | 'misc', string[]>;
}> = ({
  projectPath,
  visible,
  versions,
  zoom,
  onControlsChange,
  categories,
}) => {
  const selected = useAppStore((s) => s.selectedAssets);
  const deleteFiles = useAppStore((s) => s.deleteFiles);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleDeleteSelected = () => {
    deleteFiles(selected.map((s) => path.join(projectPath, s)));
  };

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
          <FileTree files={visible} versions={versions} />
        </div>
      </div>
    </div>
  );
};

const AssetBrowser: React.FC = () => {
  const projectPath = useAppStore((s) => s.projectPath)!;
  const { files, noExport, versions } = useProjectFiles();
  React.useEffect(() => {
    useAppStore.setState({ noExport });
  }, [noExport]);
  const renameTarget = useAppStore((s) => s.renameTarget);
  const moveTarget = useAppStore((s) => s.moveTarget);
  const closeDialogs = useAppStore((s) => s.closeDialogs);
  const [query, setQuery] = useState('');
  const [zoom, setZoom] = useState(64);
  const [filters, setFilters] = useState<Filter[]>([]);

  const visible = React.useMemo(
    () =>
      files.filter((f) => {
        if (query && !f.includes(query)) return false;
        const cat = getCategory(normalizeForCategory(f));
        if (filters.length > 0) {
          if (cat === 'misc') return false;
          if (!filters.includes(cat)) return false;
        }
        return true;
      }),
    [files, query, filters]
  );

  const categories = React.useMemo(() => {
    const out: Record<Filter | 'misc', string[]> = {
      blocks: [],
      items: [],
      entity: [],
      ui: [],
      audio: [],
      lang: [],
      misc: [],
    };
    for (const f of visible) {
      const cat = getCategory(normalizeForCategory(f));
      if (out[cat]) out[cat].push(f);
      else out.misc.push(f);
    }
    return out;
  }, [visible]);

  const handleControlsChange = (state: ControlsState) => {
    setQuery(state.query);
    setZoom(state.zoom);
    setFilters(state.filters);
  };

  return (
    <>
      <BrowserBody
        projectPath={projectPath}
        visible={visible}
        versions={versions}
        zoom={zoom}
        onControlsChange={handleControlsChange}
        categories={categories}
      />
      {renameTarget && (
        <RenameModal
          current={path.basename(renameTarget)}
          onCancel={closeDialogs}
          onRename={(n) => {
            const full = path.join(projectPath, renameTarget);
            const target = path.join(path.dirname(full), n);
            window.electronAPI?.renameFile(full, target);
            closeDialogs();
          }}
        />
      )}
      {moveTarget && (
        <MoveFileModal
          current={moveTarget}
          onCancel={closeDialogs}
          onMove={(dest) => {
            const full = path.join(projectPath, moveTarget);
            const target = path.join(
              projectPath,
              dest,
              path.basename(moveTarget)
            );
            window.electronAPI?.renameFile(full, target);
            closeDialogs();
          }}
        />
      )}
    </>
  );
};

export default AssetBrowser;
