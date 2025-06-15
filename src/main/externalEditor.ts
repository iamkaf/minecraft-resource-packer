import { spawn } from 'child_process';
import type { IpcMain } from 'electron';
import { getTextureEditor } from './layout';

export function openWithEditor(file: string): void {
  const editor = getTextureEditor();
  if (!editor) return;
  spawn(editor, [file], {
    detached: true,
    stdio: 'ignore',
  }).unref();
}

export function registerExternalEditorHandlers(ipc: IpcMain): void {
  ipc.handle('open-external-editor', (_e, file: string) =>
    openWithEditor(file)
  );
}
