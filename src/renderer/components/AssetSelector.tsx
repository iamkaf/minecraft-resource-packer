import React, { useEffect, useState } from 'react';
import TextureGrid, { TextureInfo } from './TextureGrid';
import TextureTree from './TextureTree';
import { FilterBadge, InputField, Range } from './daisy/input';
import { Button } from './daisy/actions';
import { Accordion } from './daisy/display';

interface Props {
  path: string;
  onAssetSelect?: (name: string) => void;
}

const FILTERS = ['blocks', 'items', 'entity', 'ui', 'audio'] as const;
type Filter = (typeof FILTERS)[number];

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

const AssetSelector: React.FC<Props> = ({
  path: projectPath,
  onAssetSelect,
}) => {
  const [all, setAll] = useState<TextureInfo[]>([]);
  const [query, setQuery] = useState('');
  const [zoom, setZoom] = useState(64);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [view, setView] = useState<'grid' | 'tree'>('grid');

  useEffect(() => {
    const load = async () => {
      const list = await window.electronAPI?.listTextures(projectPath);
      if (!list) return;
      const entries = await Promise.all(
        list.map(async (name) => ({
          name,
          url:
            (await window.electronAPI?.getTextureUrl(projectPath, name)) ?? '',
        }))
      );
      setAll(entries);
    };
    void load();
  }, [projectPath]);

  const filtered = query
    ? all.filter((t) => {
        if (!t.name.includes(query)) return false;
        if (
          filters.length > 0 &&
          !filters.includes(getCategory(t.name) as Filter)
        ) {
          return false;
        }
        return true;
      })
    : [];

  const categories = React.useMemo(() => {
    const out: Record<Filter | 'misc', TextureInfo[]> = {
      blocks: [],
      items: [],
      entity: [],
      ui: [],
      audio: [],
      misc: [],
    };
    for (const tex of filtered) {
      const cat = getCategory(tex.name);
      if (out[cat]) out[cat].push(tex);
      else out.misc.push(tex);
    }
    return out;
  }, [filtered]);

  const handleSelect = (name: string) => {
    onAssetSelect?.(name);
  };

  const toggleFilter = (f: Filter) => {
    setFilters((prev) =>
      prev.includes(f) ? prev.filter((p) => p !== f) : [...prev, f]
    );
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <InputField
          className="flex-1"
          placeholder="Search texture"
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
        <div className="btn-group">
          <Button
            className={`btn-xs ${view === 'grid' ? 'btn-primary' : ''}`}
            onClick={() => setView('grid')}
          >
            Grid
          </Button>
          <Button
            className={`btn-xs ${view === 'tree' ? 'btn-primary' : ''}`}
            onClick={() => setView('tree')}
          >
            Tree
          </Button>
        </div>
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
      {view === 'grid' ? (
        (['blocks', 'items', 'entity', 'ui', 'audio', 'misc'] as const).map(
          (key) => {
            const list = categories[key];
            if (list.length === 0) return null;
            return (
              <Accordion key={key} title={key} className="mb-2" defaultOpen>
                <TextureGrid
                  testId="texture-grid"
                  textures={list}
                  zoom={zoom}
                  onSelect={handleSelect}
                />
              </Accordion>
            );
          }
        )
      ) : (
        <TextureTree textures={filtered} onSelect={handleSelect} />
      )}
    </div>
  );
};

export default AssetSelector;
