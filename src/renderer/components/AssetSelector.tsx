import React, { useEffect, useState } from 'react';
import TextureGrid, { TextureInfo } from './TextureGrid';

interface Props {
  path: string;
}

const AssetSelector: React.FC<Props> = ({ path: projectPath }) => {
  const [all, setAll] = useState<TextureInfo[]>([]);
  const [query, setQuery] = useState('');
  const [zoom, setZoom] = useState(64);

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

  const filtered = query ? all.filter((t) => t.name.includes(query)) : [];

  const categories = React.useMemo(() => {
    const out: Record<string, TextureInfo[]> = {
      blocks: [],
      items: [],
      entity: [],
      ui: [],
      audio: [],
      misc: [],
    };
    for (const tex of filtered) {
      if (tex.name.startsWith('block/')) out.blocks.push(tex);
      else if (tex.name.startsWith('item/')) out.items.push(tex);
      else if (tex.name.startsWith('entity/')) out.entity.push(tex);
      else if (
        tex.name.startsWith('gui/') ||
        tex.name.startsWith('font/') ||
        tex.name.startsWith('misc/')
      )
        out.ui.push(tex);
      else if (tex.name.startsWith('sound/') || tex.name.startsWith('sounds/'))
        out.audio.push(tex);
      else out.misc.push(tex);
    }
    return out;
  }, [filtered]);

  const handleSelect = (name: string) => {
    window.electronAPI?.addTexture(projectPath, name);
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
      {(['blocks', 'items', 'entity', 'ui', 'audio', 'misc'] as const).map(
        (key) => {
          const list = categories[key];
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
