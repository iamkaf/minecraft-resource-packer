import { describe, it, expect } from 'vitest';
import * as manager from '../src/main/projects/manager';
import * as importer from '../src/main/projects/importer';
import * as meta from '../src/main/projects/meta';
import * as index from '../src/main/projects';

describe('projects module re-exports', () => {
  it('exposes manager functions', () => {
    expect(index.createProject).toBe(manager.createProject);
    expect(index.listProjects).toBe(manager.listProjects);
  });

  it('exposes importer functions', () => {
    expect(index.importProject).toBe(importer.importProject);
  });

  it('exposes meta functions', () => {
    expect(index.loadPackMeta).toBe(meta.loadPackMeta);
    expect(index.savePackMeta).toBe(meta.savePackMeta);
  });
});
