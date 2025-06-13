import { ipcMain, shell } from 'electron';
import fs from 'fs';
import path from 'path';

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

  ipcMain.handle('list-files', (_e, dir: string) => {
    const out: string[] = [];
    const walk = (baseRel: string) => {
      for (const entry of fs.readdirSync(path.join(dir, baseRel), {
        withFileTypes: true,
      })) {
        const rel = path.join(baseRel, entry.name);
        if (entry.isDirectory()) {
          walk(rel);
        } else {
          out.push(rel.split(path.sep).join('/'));
        }
      }
    };
    walk('');
    return out;
  });
}
