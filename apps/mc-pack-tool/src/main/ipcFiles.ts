import { ipcMain, shell } from 'electron';
import fs from 'fs';

/** Register IPC handlers for file interactions. */
export function registerFileHandlers() {
  ipcMain.handle('open-in-folder', (_e, file: string) => {
    shell.showItemInFolder(file);
  });

  ipcMain.handle('open-file', (_e, file: string) => {
    shell.openPath(file);
  });

  ipcMain.handle(
    'rename-file',
    async (_e, oldPath: string, newPath: string) => {
      await fs.promises.rename(oldPath, newPath);
    }
  );

  ipcMain.handle('delete-file', async (_e, file: string) => {
    await fs.promises.unlink(file);
  });
}
