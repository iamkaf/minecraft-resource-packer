import React, { useEffect, useRef, useState } from 'react';
import path from 'path';
import RenameModal from '../modals/RenameModal';
import MoveFileModal from '../modals/MoveFileModal';
import AssetBrowserItem from './AssetBrowserItem';
import { useProjectFiles } from '../file/useProjectFiles';
import FileTree from './FileTree';
import { useProject } from '../providers/ProjectProvider';
import {
  AssetBrowserProvider,
  useAssetBrowser,
} from '../providers/AssetBrowserProvider';
import { FilterBadge, InputField, Range } from '../daisy/input';
import { Accordion } from '../daisy/display';

interface Props {
  onSelectionChange?: (sel: string[]) => void;
}

const FILTERS = ['blocks', 'items', 'entity', 'ui', 'audio', 'lang'] as const;
type Filter = (typeof FILTERS)[number];

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
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  filters: Filter[];
  toggleFilter: (f: Filter) => void;
}> = ({
  projectPath,
  visible,
  versions,
  query,
  setQuery,
  zoom,
  setZoom,
  filters,
  toggleFilter,
}) => {
  const { selected, deleteFiles } = useAssetBrowser();
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  const handleDeleteSelected = () => {
    deleteFiles(Array.from(selected).map((s) => path.join(projectPath, s)));
  };

  return (
    <div
      data-testid="asset-browser"
      ref={wrapperRef}
      className="overflow-auto"
      onKeyDown={(e) => {
        if (e.key === 'Delete' && selected.size > 0) {
          e.preventDefault();
          handleDeleteSelected();
        }
      }}
      tabIndex={0}
    >
      <div className="flex items-center gap-2 mb-2">
        <InputField
          className="flex-1"
          placeholder="Search files"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Range
          min={24}
          max={128}
          step={1}
          value={zoom}
          aria-label="Zoom"
          data-testid="zoom-range"
          onChange={(e) => setZoom(Number(e.target.value))}
          className="range-xs w-32"
        />
      </div>
      <div className="flex gap-1 mb-2">
        {FILTERS.map((f) => (
          <FilterBadge
            key={f}
            label={f.charAt(0).toUpperCase() + f.slice(1)}
            selected={filters.includes(f)}
            onClick={() => toggleFilter(f)}
            onKeyDown={(e) => e.key === 'Enter' && toggleFilter(f)}
          />
        ))}
      </div>
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
          ).map((key) => {
            const list = categories[key];
            if (list.length === 0) return null;
            return (
              <Accordion key={key} title={key} className="mb-2" defaultOpen>
                <div className="grid grid-cols-6 gap-2">
                  {list.map((f) => (
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
          })}
        </div>
        <div>
          <FileTree files={visible} versions={versions} />
        </div>
      </div>
    </div>
  );
};

const AssetBrowser: React.FC<Props> = ({ onSelectionChange }) => {
  const { path: projectPath } = useProject();
  const { files, noExport, toggleNoExport, versions } = useProjectFiles();
  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const [moveTarget, setMoveTarget] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [zoom, setZoom] = useState(64);
  const [filters, setFilters] = useState<Filter[]>([]);

  useEffect(() => {
    Promise.all([
      window.electronAPI?.getAssetSearch?.(),
      window.electronAPI?.getAssetFilters?.(),
      window.electronAPI?.getAssetZoom?.(),
    ]).then(([search, filts, z]) => {
      if (search) setQuery(search);
      if (filts) setFilters(filts as Filter[]);
      if (z) setZoom(z);
    });
  }, []);

  useEffect(() => {
    window.electronAPI?.setAssetSearch?.(query);
    window.electronAPI?.setAssetFilters?.(filters);
    window.electronAPI?.setAssetZoom?.(zoom);
  }, [query, filters, zoom]);

  const visible = files.filter((f) => {
    if (query && !f.includes(query)) return false;
    const cat = getCategory(normalizeForCategory(f));
    if (filters.length > 0) {
      if (cat === 'misc') return false;
      if (!filters.includes(cat)) return false;
    }
    return true;
  });

  const toggleFilter = (f: Filter) => {
    setFilters((prev) =>
      prev.includes(f) ? prev.filter((p) => p !== f) : [...prev, f]
    );
  };

  return (
    <AssetBrowserProvider
      noExport={noExport}
      toggleNoExport={toggleNoExport}
      openRename={(file) => setRenameTarget(file)}
      openMove={(file) => setMoveTarget(file)}
      onSelectionChange={onSelectionChange}
    >
      <BrowserBody
        projectPath={projectPath}
        visible={visible}
        versions={versions}
        query={query}
        setQuery={setQuery}
        zoom={zoom}
        setZoom={setZoom}
        filters={filters}
        toggleFilter={toggleFilter}
      />
      {renameTarget && (
        <RenameModal
          current={path.basename(renameTarget)}
          onCancel={() => setRenameTarget(null)}
          onRename={(n) => {
            const full = path.join(projectPath, renameTarget);
            const target = path.join(path.dirname(full), n);
            window.electronAPI?.renameFile(full, target);
            setRenameTarget(null);
          }}
        />
      )}
      {moveTarget && (
        <MoveFileModal
          current={moveTarget}
          onCancel={() => setMoveTarget(null)}
          onMove={(dest) => {
            const full = path.join(projectPath, moveTarget);
            const target = path.join(
              projectPath,
              dest,
              path.basename(moveTarget)
            );
            window.electronAPI?.renameFile(full, target);
            setMoveTarget(null);
          }}
        />
      )}
    </AssetBrowserProvider>
  );
};

export default AssetBrowser;
