import type { Filter } from '../components/assets/AssetBrowserControls';

/** Normalize a file path for category detection. */
export const normalizeForCategory = (file: string): string => {
  const texIdx = file.indexOf('textures/');
  if (texIdx >= 0) return file.slice(texIdx + 'textures/'.length);
  const soundIdx = file.indexOf('sounds/');
  if (soundIdx >= 0) return file.slice(soundIdx);
  const soundIdx2 = file.indexOf('sound/');
  if (soundIdx2 >= 0) return file.slice(soundIdx2);
  return file;
};

/** Determine the asset category from a normalized path. */
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
  if (name.startsWith('lang/')) return 'lang';
  return 'misc';
};

/** Group a list of file paths by category. */
export const groupFilesByCategory = (
  files: string[]
): Record<Filter | 'misc', string[]> => {
  const out: Record<Filter | 'misc', string[]> = {
    blocks: [],
    items: [],
    entity: [],
    ui: [],
    audio: [],
    lang: [],
    misc: [],
  };
  for (const f of files) {
    const cat = getCategory(normalizeForCategory(f));
    if (out[cat]) out[cat].push(f);
    else out.misc.push(f);
  }
  return out;
};
