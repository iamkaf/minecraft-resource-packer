import React from 'react';
import TextureGrid, { TextureInfo } from './TextureGrid';
import type { Filter } from './AssetSelectorControls';

export const CATEGORY_KEYS = [
  'blocks',
  'items',
  'entity',
  'ui',
  'audio',
  'misc',
] as const;

export const getCategory = (name: string): Filter | 'misc' => {
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

interface Props {
  textures: TextureInfo[];
  zoom: number;
  onSelect: (name: string) => void;
  onContextMenu?: (e: React.MouseEvent, name: string) => void;
  onKeyDown?: (e: React.KeyboardEvent, name: string) => void;
}

export default function AssetCategoryList({
  textures,
  zoom,
  onSelect,
  onContextMenu,
  onKeyDown,
}: Props) {
  const categories = React.useMemo(() => {
    const out: Record<Filter | 'misc', TextureInfo[]> = {
      blocks: [],
      items: [],
      entity: [],
      ui: [],
      audio: [],
      misc: [],
    };
    for (const tex of textures) {
      const cat = getCategory(tex.name);
      if (out[cat]) out[cat].push(tex);
      else out.misc.push(tex);
    }
    return out;
  }, [textures]);

  return (
    <>
      {CATEGORY_KEYS.map((key) => {
        const list = categories[key];
        if (list.length === 0) return null;
        return (
          <div key={key} className="mb-2">
            <h3 className="text-lg font-medium capitalize mb-1">{key}</h3>
            <TextureGrid
              testId="texture-grid"
              textures={list}
              zoom={zoom}
              onSelect={onSelect}
              onContextMenu={onContextMenu}
              onKeyDown={onKeyDown}
            />
          </div>
        );
      })}
    </>
  );
}
