import { describe, it, expect } from 'vitest';
import { createDefaultProjectMeta } from '../src/shared/project';

describe('createDefaultProjectMeta', () => {
  it('creates default metadata', () => {
    const meta = createDefaultProjectMeta('pack', '1.20');
    expect(meta.name).toBe('pack');
    expect(meta.minecraft_version).toBe('1.20');
    expect(typeof meta.created).toBe('number');
    expect(meta.lastOpened).toBeGreaterThanOrEqual(meta.created);
  });
});
