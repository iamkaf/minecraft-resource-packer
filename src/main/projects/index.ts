/**
 * Aggregates project management utilities and IPC registration helpers.
 */
import type { IpcMain } from 'electron';
import { shell } from 'electron';
import path from 'path';
import { listPackFormats } from '../assets';
import { setActiveProject } from '../assets/protocols';
import { setLastProject } from '../layout';
import type { PackMeta } from '../../shared/project';

export type { PackMeta } from '../../shared/project';
export type { ProjectInfo } from './manager';
export type { ImportSummary } from './importer';
export {
  createProject,
  listProjects,
  openProject,
  duplicateProject,
  renameProject,
  deleteProject,
} from './manager';
export { importProject } from './importer';
export { loadPackMeta, savePackMeta } from './meta';

import {
  createProject,
  listProjects,
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
  ipc.handle('create-project', (_e, name: string, minecraftVersion: string) => {
    return createProject(baseDir, name, minecraftVersion);
  });
  ipc.handle('open-project', async (_e, name: string) => {
    const projectPath = await openProject(baseDir, name);
    const ok = await setActiveProject(projectPath);
    if (!ok) throw new Error('Invalid project.json');
    setLastProject(name);
    onOpen(projectPath);
  });
  ipc.handle('duplicate-project', (_e, name: string, newName: string) => {
    return duplicateProject(baseDir, name, newName);
  });
  ipc.handle('rename-project', (_e, name: string, newName: string) => {
    return renameProject(baseDir, name, newName);
  });
  ipc.handle('delete-project', (_e, name: string) => {
    return deleteProject(baseDir, name);
  });
  ipc.handle('open-project-folder', (_e, name: string) => {
    shell.showItemInFolder(path.join(baseDir, name));
  });
  ipc.handle('import-project', async () => {
    return importProject(baseDir);
  });
  ipc.handle('load-pack-meta', (_e, name: string) => {
    return loadPackMeta(baseDir, name);
  });
  ipc.handle('save-pack-meta', (_e, name: string, meta: PackMeta) => {
    return savePackMeta(baseDir, name, meta);
  });
}
