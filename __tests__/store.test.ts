import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../src/renderer/store';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      projectPath: null,
      selectedAssets: [],
      noExport: new Set(),
      renameTarget: null,
      moveTarget: null,
    });
  });

  it('has default values', () => {
    const s = useAppStore.getState();
    expect(s.projectPath).toBeNull();
    expect(s.selectedAssets).toEqual([]);
    expect(s.noExport.size).toBe(0);
  });

  it('updates basic fields', () => {
    const s = useAppStore.getState();
    s.setProjectPath('/p');
    s.setSelectedAssets(['a']);
    expect(useAppStore.getState().projectPath).toBe('/p');
    expect(useAppStore.getState().selectedAssets).toEqual(['a']);
  });

  it('toggles noExport and deletes files', () => {
    const s = useAppStore.getState();
    s.setProjectPath('/p');
    s.toggleNoExport(['a'], true);
    expect(useAppStore.getState().noExport.has('a')).toBe(true);
    s.setSelectedAssets(['a']);
    s.deleteFiles(['/p/a']);
    expect(useAppStore.getState().selectedAssets).toEqual([]);
  });

  it('manages dialog targets', () => {
    const s = useAppStore.getState();
    s.openRename('a');
    expect(useAppStore.getState().renameTarget).toBe('a');
    s.openMove('b');
    expect(useAppStore.getState().moveTarget).toBe('b');
    s.closeDialogs();
    expect(useAppStore.getState().renameTarget).toBeNull();
    expect(useAppStore.getState().moveTarget).toBeNull();
  });
});
