import { describe, it, expect } from 'vitest';
import {
  packFormatForVersion,
  versionForFormat,
  versionRangeForFormat,
  displayForFormat,
} from '../src/shared/packFormat';

describe('packFormatForVersion', () => {
  it('maps release versions correctly', () => {
    expect(packFormatForVersion('1.20.1')).toBe(15);
  });

  it('maps snapshot versions', () => {
    expect(packFormatForVersion('24w40a')).toBe(40);
  });

  it('returns null for unknown versions', () => {
    expect(packFormatForVersion('0.0.1')).toBeNull();
  });
});

describe('format lookups', () => {
  it('maps format to latest version', () => {
    expect(versionForFormat(15)).toBe('1.20.1');
  });

  it('returns version range for format', () => {
    expect(versionRangeForFormat(15)).toEqual({
      min: '1.20',
      max: '1.20.1',
      format: 15,
    });
  });

  it('creates display string for ranges', () => {
    expect(displayForFormat(15)).toBe('1.20 - 1.20.1');
  });

  it('handles unknown format', () => {
    expect(displayForFormat(999)).toBeNull();
  });
});
