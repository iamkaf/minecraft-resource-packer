import type { IpcMain } from 'electron';
import { shell } from 'electron';
import { emitRenamed } from './ipc/fileWatcher';
import fs from 'fs';

/** Register IPC handlers for file interactions. */
export function registerFileHandlers(ipc: IpcMain) {
  ipc.handle('open-in-folder', (_e, file: string) => {
    shell.showItemInFolder(file);
  });

  ipc.handle('open-file', (_e, file: string) => {
    shell.openPath(file);
  });

  ipc.handle('rename-file', async (_e, oldPath: string, newPath: string) => {
    await fs.promises.rename(oldPath, newPath);
    emitRenamed(oldPath, newPath);
  });

  ipc.handle('delete-file', async (_e, file: string) => {
    await fs.promises.unlink(file);
  });
}
