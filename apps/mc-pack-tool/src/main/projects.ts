import fs from 'fs';
import path from 'path';
import { dialog, ipcMain } from 'electron';
import {
  ProjectMetadata,
  ProjectMetadataSchema,
  PackMeta,
  PackMetaSchema,
} from '../shared/project';
import { listVersions, setActiveProject } from './assets';

// Re-export PackMeta so renderer and preload can import the type from this file
export type { PackMeta } from '../shared/project';
import { generatePackIcon } from './icon';

export async function createProject(
  baseDir: string,
  name: string,
  version: string
): Promise<void> {
  const dir = path.join(baseDir, name);
  if (!fs.existsSync(dir)) await fs.promises.mkdir(dir, { recursive: true });
  const meta: ProjectMetadata = {
    name,
    version,
    assets: [],
    lastOpened: Date.now(),
  };
  await fs.promises.writeFile(
    path.join(dir, 'project.json'),
    JSON.stringify(meta, null, 2)
  );
  await generatePackIcon(dir);
}

export interface ProjectInfo {
  name: string;
  version: string;
  assets: number;
  lastOpened: number;
}

export async function listProjects(baseDir: string): Promise<ProjectInfo[]> {
  if (!fs.existsSync(baseDir))
    await fs.promises.mkdir(baseDir, { recursive: true });
  const entries = await fs.promises.readdir(baseDir);
  const out: ProjectInfo[] = [];
  for (const name of entries) {
    const stat = await fs.promises.stat(path.join(baseDir, name));
    if (!stat.isDirectory()) continue;
    const metaPath = path.join(baseDir, name, 'project.json');
    if (fs.existsSync(metaPath)) {
      try {
        const data = JSON.parse(await fs.promises.readFile(metaPath, 'utf-8'));
        const meta = ProjectMetadataSchema.parse(data);
        out.push({
          name: meta.name,
          version: meta.version,
          assets: meta.assets.length,
          lastOpened: meta.lastOpened ?? 0,
        });
        continue;
      } catch {
        // ignore malformed metadata
      }
    }
    out.push({ name, version: 'unknown', assets: 0, lastOpened: 0 });
  }
  return out;
}

export async function openProject(
  baseDir: string,
  name: string
): Promise<string> {
  const projectPath = path.join(baseDir, name);
  if (!fs.existsSync(projectPath))
    await fs.promises.mkdir(projectPath, { recursive: true });
  const metaPath = path.join(projectPath, 'project.json');
  if (fs.existsSync(metaPath)) {
    try {
      const data = JSON.parse(await fs.promises.readFile(metaPath, 'utf-8'));
      const meta = ProjectMetadataSchema.parse(data);
      meta.lastOpened = Date.now();
      await fs.promises.writeFile(metaPath, JSON.stringify(meta, null, 2));
    } catch {
      // ignore corrupted metadata
    }
  }
  return projectPath;
}

export async function duplicateProject(
  baseDir: string,
  name: string,
  newName: string
): Promise<void> {
  const src = path.join(baseDir, name);
  const dest = path.join(baseDir, newName);
  await fs.promises.cp(src, dest, { recursive: true });
  const metaPath = path.join(dest, 'project.json');
  if (fs.existsSync(metaPath)) {
    try {
      const data = JSON.parse(await fs.promises.readFile(metaPath, 'utf-8'));
      const meta = ProjectMetadataSchema.parse(data);
      meta.name = newName;
      await fs.promises.writeFile(metaPath, JSON.stringify(meta, null, 2));
    } catch {
      // ignore malformed metadata
    }
  }
}

export async function deleteProject(
  baseDir: string,
  name: string
): Promise<void> {
  const dir = path.join(baseDir, name);
  await fs.promises.rm(dir, { recursive: true, force: true });
}

export async function importProject(baseDir: string): Promise<void> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  if (canceled || filePaths.length === 0) return;
  const src = filePaths[0];
  const dest = path.join(baseDir, path.basename(src));
  await fs.promises.cp(src, dest, { recursive: true });
}

export async function loadPackMeta(
  baseDir: string,
  name: string
): Promise<PackMeta> {
  const metaPath = path.join(baseDir, name, 'pack.json');
  if (fs.existsSync(metaPath)) {
    try {
      const data = JSON.parse(await fs.promises.readFile(metaPath, 'utf-8'));
      return PackMetaSchema.parse(data);
    } catch {
      // ignore malformed data
    }
  }
  return { description: '', author: '', urls: [], created: Date.now() };
}

export async function savePackMeta(
  baseDir: string,
  name: string,
  meta: PackMeta
): Promise<void> {
  const metaPath = path.join(baseDir, name, 'pack.json');
  await fs.promises.writeFile(metaPath, JSON.stringify(meta, null, 2));
}

export function registerProjectHandlers(
  baseDir: string,
  onOpen: (path: string) => void
): void {
  ipcMain.handle('list-projects', () => listProjects(baseDir));
  ipcMain.handle('list-versions', () => listVersions());
  ipcMain.handle('create-project', (_e, name: string, version: string) => {
    return createProject(baseDir, name, version);
  });
  ipcMain.handle('open-project', async (_e, name: string) => {
    const projectPath = await openProject(baseDir, name);
    await setActiveProject(projectPath);
    onOpen(projectPath);
  });
  ipcMain.handle('duplicate-project', (_e, name: string, newName: string) => {
    return duplicateProject(baseDir, name, newName);
  });
  ipcMain.handle('delete-project', (_e, name: string) => {
    return deleteProject(baseDir, name);
  });
  ipcMain.handle('import-project', async () => {
    await importProject(baseDir);
  });
  ipcMain.handle('load-pack-meta', (_e, name: string) => {
    return loadPackMeta(baseDir, name);
  });
  ipcMain.handle('save-pack-meta', (_e, name: string, meta: PackMeta) => {
    return savePackMeta(baseDir, name, meta);
  });
}
