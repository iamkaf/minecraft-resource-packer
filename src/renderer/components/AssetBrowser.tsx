import React, { useEffect, useRef, useState } from 'react';
import path from 'path';
import RenameModal from './RenameModal';
import AssetBrowserItem from './AssetBrowserItem';
import { useProjectFiles } from './file/useProjectFiles';
import FileTree from './FileTree';
import { FilterBadge, InputField, Range } from './daisy/input';
import { Accordion } from './daisy/display';

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
          {(['blocks', 'items', 'entity', 'ui', 'audio', 'misc'] as const).map(
            (key) => {
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
                </Accordion>
              );
            }
          )}
        </div>
        <div>
          <FileTree
            projectPath={projectPath}
            files={visible}
            selected={selected}
            setSelected={setSelected}
            noExport={noExport}
            toggleNoExport={toggleNoExport}
            deleteFiles={deleteFiles}
            openRename={(file) => setRenameTarget(file)}
          />
        </div>
      </div>
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
