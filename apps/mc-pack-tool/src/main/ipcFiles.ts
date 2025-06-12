import { ipcMain, shell } from 'electron';

/** Register IPC handlers for file interactions. */
export function registerFileHandlers() {
  ipcMain.handle('open-in-folder', (_e, file: string) => {
    shell.showItemInFolder(file);
  });

  ipcMain.handle('open-file', (_e, file: string) => {
    shell.openPath(file);
  });
}
