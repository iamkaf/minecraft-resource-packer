import { describe, it, expect } from 'vitest';
import {
  normalizeForCategory,
  getCategory,
  groupFilesByCategory,
} from '../src/renderer/utils/category';

describe('category utils', () => {
  it('normalizes and categorizes paths', () => {
    const file = 'assets/minecraft/textures/block/stone.png';
    const norm = normalizeForCategory(file);
    expect(getCategory(norm)).toBe('blocks');
  });

  it('groups files by category', () => {
    const files = [
      'assets/minecraft/textures/block/stone.png',
      'assets/minecraft/textures/item/apple.png',
      'lang/en_us.json',
    ];
    const grouped = groupFilesByCategory(files);
    expect(grouped.blocks).toEqual([files[0]]);
    expect(grouped.items).toEqual([files[1]]);
    expect(grouped.lang).toEqual([files[2]]);
  });
});
