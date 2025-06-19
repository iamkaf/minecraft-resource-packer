import { describe, it, expect, expectTypeOf } from 'vitest';
import type { TextureEditOptions } from '../src/shared/texture';

describe('TextureEditOptions', () => {
  it('matches expected shape', () => {
    expectTypeOf<TextureEditOptions>().toEqualTypeOf<{
      rotate?: number;
      hue?: number;
      grayscale?: boolean;
      saturation?: number;
      brightness?: number;
      crop?: { x: number; y: number; width: number; height: number };
      resize?: { width: number; height: number };
      flip?: 'horizontal' | 'vertical';
      overlay?: string;
    }>();
  });

  it('allows partial option sets', () => {
    const example: TextureEditOptions = { rotate: 90 };
    expect(example.rotate).toBe(90);
    expectTypeOf<typeof example.rotate>().toEqualTypeOf<number | undefined>();
  });
});
