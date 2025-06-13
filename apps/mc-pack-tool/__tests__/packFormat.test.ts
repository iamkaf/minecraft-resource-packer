import { describe, it, expect } from 'vitest';
import { packFormatForVersion } from '../src/shared/packFormat';

describe('packFormatForVersion', () => {
  it('maps 1.20.1 correctly', () => {
    expect(packFormatForVersion('1.20.1')).toBe(15);
  });

  it('returns null for unknown versions', () => {
    expect(packFormatForVersion('0.0.1')).toBeNull();
  });
});
