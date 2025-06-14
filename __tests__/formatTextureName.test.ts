import { describe, it, expect } from 'vitest';
import { formatTextureName } from '../src/renderer/utils/textureNames';

describe('formatTextureName', () => {
  it('formats underscores and extension', () => {
    expect(formatTextureName('block/dark_oak_log.png')).toBe('Dark Oak Log');
  });

  it('handles nested paths', () => {
    expect(formatTextureName('entity/sheep/sheep_fur.png')).toBe('Sheep Fur');
  });
});
