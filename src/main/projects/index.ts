// Entry point for project utilities used by the main process.
import type { IpcMain } from 'electron';
import { listPackFormats } from '../assets';
import { setActiveProject } from '../assets/protocols';
import { setLastProject } from '../layout';
import type { PackMeta } from '../shared/project';

export type { PackMeta } from '../shared/project';
export * from './manager';
export * from './importer';
export * from './meta';

import {
  listProjects,
  createProject,
  openProject,
  duplicateProject,
  renameProject,
  deleteProject,
} from './manager';
import { importProject } from './importer';
import { loadPackMeta, savePackMeta } from './meta';

export function registerProjectHandlers(
  ipc: IpcMain,
  baseDir: string,
  onOpen: (path: string) => void
): void {
  ipc.handle('list-projects', () => listProjects(baseDir));
  ipc.handle('list-formats', () => listPackFormats());
  ipc.handle('create-project', (_e, name: string, minecraftVersion: string) =>
    createProject(baseDir, name, minecraftVersion)
  );
  ipc.handle('open-project', async (_e, name: string) => {
    const projectPath = await openProject(baseDir, name);
    setLastProject(name);
    await setActiveProject(projectPath);
    onOpen(projectPath);
  });
  ipc.handle('duplicate-project', (_e, name: string, newName: string) =>
    duplicateProject(baseDir, name, newName)
  );
  ipc.handle('rename-project', (_e, name: string, newName: string) =>
    renameProject(baseDir, name, newName)
  );
  ipc.handle('delete-project', (_e, name: string) =>
    deleteProject(baseDir, name)
  );
  ipc.handle('import-project', async () => importProject(baseDir));
  ipc.handle('load-pack-meta', (_e, name: string) =>
    loadPackMeta(baseDir, name)
  );
  ipc.handle('save-pack-meta', (_e, name: string, meta: PackMeta) =>
    savePackMeta(baseDir, name, meta)
  );
}
