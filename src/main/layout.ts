import type { IpcMain } from 'electron';
import { app } from 'electron';
import Store from 'electron-store';

type ThemePref = 'light' | 'dark' | 'system';

type StoreSchema = {
  editorLayout: number[];
  textureEditor: string;
  theme: ThemePref;
  confetti: boolean;
  defaultExportDir: string;
  projectSortKey: keyof import('./projects').ProjectInfo;
  projectSortAsc: boolean;
  assetSearch: string;
  assetFilters: string[];
  assetZoom: number;
  openLastProject: boolean;
  lastProject: string;
};

const store = new Store<StoreSchema>({
  defaults: {
    editorLayout: [20, 80],
    textureEditor: '',
    theme: 'system',
    confetti: true,
    defaultExportDir: app.getPath('downloads'),
    projectSortKey: 'name',
    projectSortAsc: true,
    assetSearch: '',
    assetFilters: [],
    assetZoom: 64,
    openLastProject: true,
    lastProject: '',
  },
});

const getter =
  <K extends keyof StoreSchema>(key: K) =>
  () =>
    store.get(key);
const setter =
  <K extends keyof StoreSchema>(key: K) =>
  (value: StoreSchema[K]) =>
    store.set(key, value);

export const getEditorLayout = getter('editorLayout');
export const setEditorLayout = setter('editorLayout');

export const getTextureEditor = getter('textureEditor');
export const setTextureEditor = setter('textureEditor');

export const getTheme = getter('theme');
export const setTheme = setter('theme');

export const getConfetti = getter('confetti');
export const setConfetti = setter('confetti');

export const getDefaultExportDir = getter('defaultExportDir');
export const setDefaultExportDir = setter('defaultExportDir');

export function getProjectSort(): {
  key: keyof import('./projects').ProjectInfo;
  asc: boolean;
} {
  return { key: store.get('projectSortKey'), asc: store.get('projectSortAsc') };
}

export function setProjectSort(
  key: keyof import('./projects').ProjectInfo,
  asc: boolean
): void {
  store.set('projectSortKey', key);
  store.set('projectSortAsc', asc);
}

export const getAssetSearch = getter('assetSearch');
export const setAssetSearch = setter('assetSearch');

export const getAssetFilters = getter('assetFilters');
export const setAssetFilters = setter('assetFilters');

export const getAssetZoom = getter('assetZoom');
export const setAssetZoom = setter('assetZoom');

export const getOpenLastProject = getter('openLastProject');
export const setOpenLastProject = setter('openLastProject');

export const getLastProject = getter('lastProject');
export const setLastProject = setter('lastProject');

export function registerLayoutHandlers(ipc: IpcMain): void {
  const pairs: [string, () => unknown, (v: unknown) => void][] = [
    ['editor-layout', getEditorLayout, setEditorLayout],
    ['texture-editor', getTextureEditor, setTextureEditor],
    ['theme', getTheme, setTheme],
    ['confetti', getConfetti, setConfetti],
    ['default-export-dir', getDefaultExportDir, setDefaultExportDir],
    ['asset-search', getAssetSearch, setAssetSearch],
    ['asset-filters', getAssetFilters, setAssetFilters],
    ['asset-zoom', getAssetZoom, setAssetZoom],
    ['open-last-project', getOpenLastProject, setOpenLastProject],
    ['last-project', getLastProject, setLastProject],
  ];
  for (const [name, get, set] of pairs) {
    ipc.handle(`get-${name}`, () => get());
    ipc.handle(`set-${name}`, (_e, val) => set(val));
  }
  ipc.handle('get-project-sort', () => getProjectSort());
  ipc.handle(
    'set-project-sort',
    (_e, k: keyof import('./projects').ProjectInfo, s: boolean) =>
      setProjectSort(k, s)
  );
}
