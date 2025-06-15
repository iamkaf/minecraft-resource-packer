import type { IpcMain } from 'electron';
import Store from 'electron-store';

type ThemePref = 'light' | 'dark' | 'system';

const store = new Store<{
  editorLayout: number[];
  textureEditor: string;
  theme: ThemePref;
  confetti: boolean;
}>({
  defaults: {
    editorLayout: [20, 80],
    textureEditor: '',
    theme: 'system',
    confetti: true,
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
}
