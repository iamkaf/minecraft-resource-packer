import React, { useEffect, useState } from 'react';
import TextureGrid, { TextureInfo } from './TextureGrid';

interface Props {
  path: string;
  onAssetSelect?: (name: string) => void;
}

const FILTERS = ['blocks', 'items', 'entity', 'ui', 'audio'] as const;
type Filter = (typeof FILTERS)[number];

const getCategory = (name: string): Filter | 'misc' => {
  const norm = (() => {
    const parts = name.split('/');
    const tIndex = parts.indexOf('textures');
    if (tIndex !== -1 && parts.length > tIndex + 1)
      return parts.slice(tIndex + 1).join('/');
    return name;
  })();
  if (norm.startsWith('block/')) return 'blocks';
  if (norm.startsWith('item/')) return 'items';
  if (norm.startsWith('entity/')) return 'entity';
  if (
    norm.startsWith('gui/') ||
    norm.startsWith('font/') ||
    norm.startsWith('misc/')
  )
    return 'ui';
  if (norm.startsWith('sound/') || norm.startsWith('sounds/')) return 'audio';
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
        const cat = getCategory(t.name);
        if (filters.length > 0) {
          if (cat === 'misc') return false;
          if (!filters.includes(cat)) return false;
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
    window.electronAPI?.addTexture(projectPath, name);
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
        <input
          className="border px-1 flex-1"
          placeholder="Search texture"
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
      {(['blocks', 'items', 'entity', 'ui', 'audio', 'misc'] as const).map(
        (key) => {
          const list = categories[key];
          if (list.length === 0) return null;
          return (
            <div className="collapse collapse-arrow mb-2" key={key}>
              <input type="checkbox" defaultChecked />
              <div className="collapse-title font-medium capitalize">{key}</div>
              <div className="collapse-content">
                <TextureGrid
                  testId="texture-grid"
                  textures={list}
                  zoom={zoom}
                  onSelect={handleSelect}
                />
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default AssetSelector;
