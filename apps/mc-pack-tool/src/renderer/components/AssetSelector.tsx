import React, { useEffect, useState } from 'react';

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
      <input
        className="border px-1 mb-2"
        placeholder="Search texture"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul className="h-48 overflow-y-scroll border p-1">
        {filtered.map((tex) => (
          <li key={tex.name} className="flex items-center space-x-2">
            <img src={tex.url} alt={tex.name} className="w-8 h-8" />
            <button
              className="underline text-blue-600"
              onClick={() => handleSelect(tex.name)}
            >
              {tex.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssetSelector;
