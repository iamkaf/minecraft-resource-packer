import React, { useEffect, useRef, useState } from 'react';
import path from 'path';
import RenameModal from './RenameModal';
import AssetBrowserItem from './AssetBrowserItem';
import { useProjectFiles } from './file/useProjectFiles';
import FileTree from './FileTree';

interface Props {
  path: string;
  onSelectionChange?: (sel: string[]) => void;
}

const FILTERS = ['blocks', 'items', 'entity', 'ui', 'audio'] as const;
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
  return 'misc';
};

const AssetBrowser: React.FC<Props> = ({
  path: projectPath,
  onSelectionChange,
}) => {
  const { files, noExport, toggleNoExport } = useProjectFiles(projectPath);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [zoom, setZoom] = useState(64);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [view, setView] = useState<'grid' | 'tree'>('grid');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onSelectionChange?.(Array.from(selected));
  }, [selected, onSelectionChange]);

  const visible = files.filter((f) => {
    if (query && !f.includes(query)) return false;
    const cat = getCategory(normalizeForCategory(f));
    if (filters.length > 0) {
      if (cat === 'misc') return false;
      if (!filters.includes(cat)) return false;
    }
    return true;
  });

  const categories = React.useMemo(() => {
    const out: Record<Filter | 'misc', string[]> = {
      blocks: [],
      items: [],
      entity: [],
      ui: [],
      audio: [],
      misc: [],
    };
    for (const f of visible) {
      const cat = getCategory(normalizeForCategory(f));
      if (out[cat]) out[cat].push(f);
      else out.misc.push(f);
    }
    return out;
  }, [visible]);

  const toggleFilter = (f: Filter) => {
    setFilters((prev) =>
      prev.includes(f) ? prev.filter((p) => p !== f) : [...prev, f]
    );
  };

  const deleteFiles = (files: string[]) => {
    files.forEach((f) => window.electronAPI?.deleteFile(f));
    setSelected(new Set());
  };

  const handleDeleteSelected = () => {
    deleteFiles(Array.from(selected).map((s) => path.join(projectPath, s)));
  };

  return (
    <div
      data-testid="asset-browser"
      ref={wrapperRef}
      onKeyDown={(e) => {
        if (e.key === 'Delete' && selected.size > 0) {
          e.preventDefault();
          handleDeleteSelected();
        }
      }}
      tabIndex={0}
    >
      <div className="flex items-center gap-2 mb-2">
        <input
          className="border px-1 flex-1"
          placeholder="Search files"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          type="range"
          min={24}
          max={128}
          step={1}
          value={zoom}
          aria-label="Zoom"
          data-testid="zoom-range"
          onChange={(e) => setZoom(Number(e.target.value))}
          className="range range-xs w-32"
        />
        <div className="btn-group">
          <button
            className={`btn btn-xs ${view === 'grid' ? 'btn-primary' : ''}`}
            onClick={() => setView('grid')}
          >
            Grid
          </button>
          <button
            className={`btn btn-xs ${view === 'tree' ? 'btn-primary' : ''}`}
            onClick={() => setView('tree')}
          >
            Tree
          </button>
        </div>
      </div>
      <div className="flex gap-1 mb-2">
        {FILTERS.map((f) => (
          <span
            key={f}
            role="button"
            tabIndex={0}
            onClick={() => toggleFilter(f)}
            onKeyDown={(e) => e.key === 'Enter' && toggleFilter(f)}
            className={`badge badge-outline cursor-pointer select-none ${
              filters.includes(f) ? 'badge-primary' : ''
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </span>
        ))}
      </div>
      {view === 'grid' ? (
        (['blocks', 'items', 'entity', 'ui', 'audio', 'misc'] as const).map(
          (key) => {
            const list = categories[key];
            if (list.length === 0) return null;
            return (
              <div className="collapse collapse-arrow mb-2" key={key}>
                <input type="checkbox" defaultChecked />
                <div className="collapse-title font-medium capitalize">
                  {key}
                </div>
                <div className="collapse-content">
                  <div className="grid grid-cols-6 gap-2">
                    {list.map((f) => (
                      <AssetBrowserItem
                        key={f}
                        projectPath={projectPath}
                        file={f}
                        selected={selected}
                        setSelected={setSelected}
                        noExport={noExport}
                        toggleNoExport={toggleNoExport}
                        deleteFiles={deleteFiles}
                        openRename={(file) => setRenameTarget(file)}
                        zoom={zoom}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          }
        )
      ) : (
        <FileTree
          files={visible}
          selected={selected}
          setSelected={setSelected}
        />
      )}
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
    </div>
  );
};

export default AssetBrowser;
