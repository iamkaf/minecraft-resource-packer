import React, { useEffect, useState, useRef } from 'react';
import TextureTree from './TextureTree';
import AssetSelectorControls, { Filter } from './AssetSelectorControls';
import AssetCategoryList from './AssetCategoryList';
import { getCategory } from '../../utils/category';
import { TextureInfo } from './TextureGrid';
import { Button } from '../daisy/actions';
import { useAppStore } from '../../store';
import AssetSelectorContextMenu from './AssetSelectorContextMenu';

interface Props {
  onAssetSelect?: (name: string) => void;
}

const AssetSelector: React.FC<Props> = ({ onAssetSelect }) => {
  const projectPath = useAppStore((s) => s.projectPath)!;
  const [all, setAll] = useState<TextureInfo[]>([]);
  const [query, setQuery] = useState('');
  const [zoom, setZoom] = useState(64);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [view, setView] = useState<'grid' | 'tree'>('grid');
  const [menuInfo, setMenuInfo] = useState<{
    asset: string;
    x: number;
    y: number;
  } | null>(null);
  const firstItem = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (menuInfo && firstItem.current) {
      firstItem.current.focus();
    }
  }, [menuInfo]);

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

  const handleSelect = (name: string) => {
    onAssetSelect?.(name);
  };

  const showMenu = (asset: string, x: number, y: number) => {
    setMenuInfo({ asset, x, y });
  };

  const handleContext = (
    e: React.MouseEvent | React.KeyboardEvent,
    name: string
  ) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    showMenu(name, rect.right, rect.bottom);
  };

  const closeMenu = () => setMenuInfo(null);

  const toggleFilter = (f: Filter) => {
    setFilters((prev) =>
      prev.includes(f) ? prev.filter((p) => p !== f) : [...prev, f]
    );
  };

  const handleReveal = (name: string) => {
    void window.electronAPI
      ?.getTexturePath(projectPath, name)
      .then((f) => f && window.electronAPI?.openInFolder(f));
  };

  return (
    <div
      data-testid="asset-selector"
      className="mb-4 h-full"
      tabIndex={0}
      onBlur={(e) => {
        const overlay = document.getElementById('overlay-root');
        const next = e.relatedTarget as Node | null;
        if (
          !e.currentTarget.contains(next) &&
          !(overlay && overlay.contains(next))
        ) {
          closeMenu();
        }
      }}
    >
      <AssetSelectorControls
        query={query}
        setQuery={setQuery}
        zoom={zoom}
        setZoom={setZoom}
        filters={filters}
        toggleFilter={toggleFilter}
      />
      <div className="flex items-center gap-2 mb-2">
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
      {view === 'grid' ? (
        <AssetCategoryList
          textures={filtered}
          zoom={zoom}
          onSelect={handleSelect}
          onContextMenu={(e, name) => showMenu(name, e.clientX, e.clientY)}
          onKeyDown={(e, name) => handleContext(e, name)}
        />
      ) : (
        <TextureTree
          textures={filtered}
          onSelect={handleSelect}
          onContextMenu={(e, name) => showMenu(name, e.clientX, e.clientY)}
          onKeyDown={(e, name) => handleContext(e, name)}
        />
      )}
      {menuInfo && (
        <AssetSelectorContextMenu
          asset={menuInfo.asset}
          style={{
            left: menuInfo.x,
            top: menuInfo.y,
            display: 'block',
          }}
          firstItemRef={firstItem}
          onAdd={(name) => window.electronAPI?.addTexture(projectPath, name)}
          onReveal={handleReveal}
        />
      )}
    </div>
  );
};

export default AssetSelector;
