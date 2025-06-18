import { describe, it, expect } from 'vitest';
import getTexture from '../src/renderer/utils/getTexture';

describe('getTexture', () => {
  it('strips minecraft namespace and prefixes', () => {
    expect(getTexture('block', 'minecraft:block/stone')).toBe(
      'vanilla://block/stone'
    );
    expect(getTexture('item', '/item/diamond_sword')).toBe(
      'vanilla://item/diamond_sword'
    );
  });
});
