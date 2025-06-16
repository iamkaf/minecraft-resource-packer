import type { IpcMain } from 'electron';
import { app } from 'electron';
import Store from 'electron-store';

type ThemePref = 'light' | 'dark' | 'system';

const store = new Store<{
  editorLayout: number[];
  textureEditor: string;
  theme: ThemePref;
  confetti: boolean;
  defaultExportDir: string;
  projectSortKey: keyof import('./projects').ProjectInfo;
  projectSortAsc: boolean;
}>({
  defaults: {
    editorLayout: [20, 80],
    textureEditor: '',
    theme: 'system',
    confetti: true,
    defaultExportDir: app.getPath('downloads'),
    projectSortKey: 'name',
    projectSortAsc: true,
  },
});

export function getEditorLayout(): number[] {
  return store.get('editorLayout');
}

export function setEditorLayout(layout: number[]): void {
  store.set('editorLayout', layout);
}

export function getTextureEditor(): string {
  return store.get('textureEditor');
}

export function setTextureEditor(path: string): void {
  store.set('textureEditor', path);
}

export function getTheme(): ThemePref {
  return store.get('theme');
}

export function setTheme(pref: ThemePref): void {
  store.set('theme', pref);
}

export function getConfetti(): boolean {
  return store.get('confetti');
}

export function setConfetti(flag: boolean): void {
  store.set('confetti', flag);
}

export function getDefaultExportDir(): string {
  return store.get('defaultExportDir');
}

export function setDefaultExportDir(dir: string): void {
  store.set('defaultExportDir', dir);
}

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

export function registerLayoutHandlers(ipc: IpcMain): void {
  ipc.handle('get-editor-layout', () => getEditorLayout());
  ipc.handle('set-editor-layout', (_e, layout: number[]) =>
    setEditorLayout(layout)
  );
  ipc.handle('get-texture-editor', () => getTextureEditor());
  ipc.handle('set-texture-editor', (_e, p: string) => setTextureEditor(p));
  ipc.handle('get-theme', () => getTheme());
  ipc.handle('set-theme', (_e, t: ThemePref) => setTheme(t));
  ipc.handle('get-confetti', () => getConfetti());
  ipc.handle('set-confetti', (_e, c: boolean) => setConfetti(c));
  ipc.handle('get-default-export-dir', () => getDefaultExportDir());
  ipc.handle('set-default-export-dir', (_e, d: string) =>
    setDefaultExportDir(d)
  );
  ipc.handle('get-project-sort', () => getProjectSort());
  ipc.handle(
    'set-project-sort',
    (_e, k: keyof import('./projects').ProjectInfo, s: boolean) =>
      setProjectSort(k, s)
  );
}
