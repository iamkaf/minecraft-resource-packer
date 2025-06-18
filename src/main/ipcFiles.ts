import type { IpcMain } from 'electron';
import { shell } from 'electron';
import { emitRenamed } from './ipc/fileWatcher';
import fs from 'fs';
import path from 'path';
import {
  saveRevision,
  listRevisions,
  restoreRevision,
  saveRevisionForFile,
} from './revision';

/** Register IPC handlers for file interactions. */
export function registerFileHandlers(ipc: IpcMain) {
  ipc.handle('open-in-folder', (_e, file: string) => {
    shell.showItemInFolder(file);
  });

  ipc.handle('open-file', (_e, file: string) => {
    shell.openPath(file);
  });

  ipc.handle('read-file', (_e, file: string) => {
    return fs.promises.readFile(file, 'utf-8');
  });

  ipc.handle('write-file', async (_e, file: string, data: string) => {
    await saveRevisionForFile(file);
    await fs.promises.writeFile(file, data, 'utf-8');
  });

  ipc.handle(
    'save-revision',
    async (_e, project: string, rel: string, data: string) => {
      await saveRevision(project, rel);
      await fs.promises.writeFile(path.join(project, rel), data, 'utf-8');
    }
  );

  ipc.handle('list-revisions', (_e, project: string, rel: string) =>
    listRevisions(project, rel)
  );

  ipc.handle(
    'restore-revision',
    async (_e, project: string, rel: string, rev: string) => {
      await restoreRevision(project, rel, rev);
    }
  );

  ipc.handle('rename-file', async (_e, oldPath: string, newPath: string) => {
    await fs.promises.rename(oldPath, newPath);
    emitRenamed(oldPath, newPath);
  });

  ipc.handle('delete-file', async (_e, file: string) => {
    await fs.promises.unlink(file);
  });
}
