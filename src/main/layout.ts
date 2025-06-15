import type { IpcMain } from 'electron';
import Store from 'electron-store';

const store = new Store<{ editorLayout: number[] }>({
  defaults: { editorLayout: [20, 80] },
});

export function getEditorLayout(): number[] {
  return store.get('editorLayout');
}

export function setEditorLayout(layout: number[]): void {
  store.set('editorLayout', layout);
}

export function registerLayoutHandlers(ipc: IpcMain): void {
  ipc.handle('get-editor-layout', () => getEditorLayout());
  ipc.handle('set-editor-layout', (_e, layout: number[]) =>
    setEditorLayout(layout)
  );
}
