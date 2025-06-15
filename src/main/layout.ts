import type { IpcMain } from 'electron';
import Store from 'electron-store';

const store = new Store<{ editorLayout: number[]; textureEditor: string }>({
  defaults: { editorLayout: [20, 80], textureEditor: '' },
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

export function registerLayoutHandlers(ipc: IpcMain): void {
  ipc.handle('get-editor-layout', () => getEditorLayout());
  ipc.handle('set-editor-layout', (_e, layout: number[]) =>
    setEditorLayout(layout)
  );
  ipc.handle('get-texture-editor', () => getTextureEditor());
  ipc.handle('set-texture-editor', (_e, p: string) => setTextureEditor(p));
}
