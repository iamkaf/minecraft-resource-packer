import type { IpcMain } from 'electron';
import Store from 'electron-store';

const store = new Store<{
  editorLayout: number[];
  textureEditor: string;
  confettiEnabled: boolean;
}>({
  defaults: {
    editorLayout: [20, 80],
    textureEditor: '',
    confettiEnabled: true,
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

export function getConfettiEnabled(): boolean {
  return store.get('confettiEnabled');
}

export function setConfettiEnabled(flag: boolean): void {
  store.set('confettiEnabled', flag);
}

export function registerLayoutHandlers(ipc: IpcMain): void {
  ipc.handle('get-editor-layout', () => getEditorLayout());
  ipc.handle('set-editor-layout', (_e, layout: number[]) =>
    setEditorLayout(layout)
  );
  ipc.handle('get-texture-editor', () => getTextureEditor());
  ipc.handle('set-texture-editor', (_e, p: string) => setTextureEditor(p));
  ipc.handle('get-confetti-enabled', () => getConfettiEnabled());
  ipc.handle('set-confetti-enabled', (_e, flag: boolean) =>
    setConfettiEnabled(flag)
  );
}
