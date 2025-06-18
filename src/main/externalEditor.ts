import { spawn } from 'child_process';
import type { IpcMain } from 'electron';
import { getTextureEditor } from './layout';
import { saveRevisionForFile } from './revision';

export async function openWithEditor(file: string): Promise<void> {
  const editor = getTextureEditor();
  if (!editor) return;
  await saveRevisionForFile(file);
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
