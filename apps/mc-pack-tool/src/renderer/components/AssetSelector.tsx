import React, { useEffect, useState } from 'react';
import { formatTextureName } from '../utils/textureNames';

interface Props {
  path: string;
}

interface TextureInfo {
  name: string;
  url: string;
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
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 overflow-y-auto h-48">
        {filtered.map((tex) => {
          const formatted = formatTextureName(tex.name);
          return (
            <div
              key={tex.name}
              className="text-center tooltip"
              data-tip={`${formatted} \n${tex.name}`}
            >
              <button
                aria-label={tex.name}
                onClick={() => handleSelect(tex.name)}
                className="p-1 hover:ring ring-accent rounded"
              >
                <img
                  src={tex.url}
                  alt={formatted}
                  style={{
                    width: zoom,
                    height: zoom,
                    imageRendering: 'pixelated',
                  }}
                />
              </button>
              <div className="text-xs leading-tight">
                <div>{formatted}</div>
                <div className="opacity-50">{tex.name}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssetSelector;
