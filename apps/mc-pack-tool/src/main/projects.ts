import fs from 'fs';
import path from 'path';
import { dialog, ipcMain } from 'electron';
import { ProjectMetadata, ProjectMetadataSchema } from '../minecraft/project';
import { listVersions, setActiveProject } from './assets';

export function createProject(
  baseDir: string,
  name: string,
  version: string
): void {
  const dir = path.join(baseDir, name);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const meta: ProjectMetadata = {
    name,
    version,
    assets: [],
    lastOpened: Date.now(),
  };
  fs.writeFileSync(
    path.join(dir, 'project.json'),
    JSON.stringify(meta, null, 2)
  );
}

export interface ProjectInfo {
  name: string;
  version: string;
  assets: number;
  lastOpened: number;
}

export function listProjects(baseDir: string): ProjectInfo[] {
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });
  return fs
    .readdirSync(baseDir)
    .filter((f) => fs.statSync(path.join(baseDir, f)).isDirectory())
    .map((name) => {
      const metaPath = path.join(baseDir, name, 'project.json');
      if (fs.existsSync(metaPath)) {
        try {
          const data = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
          const meta = ProjectMetadataSchema.parse(data);
          return {
            name: meta.name,
            version: meta.version,
            assets: meta.assets.length,
            lastOpened: meta.lastOpened ?? 0,
          } as ProjectInfo;
        } catch {
          return { name, version: 'unknown', assets: 0, lastOpened: 0 };
        }
      }
      return { name, version: 'unknown', assets: 0, lastOpened: 0 };
    });
}

export function openProject(baseDir: string, name: string): string {
  const projectPath = path.join(baseDir, name);
  if (!fs.existsSync(projectPath))
    fs.mkdirSync(projectPath, { recursive: true });
  const metaPath = path.join(projectPath, 'project.json');
  if (fs.existsSync(metaPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      const meta = ProjectMetadataSchema.parse(data);
      meta.lastOpened = Date.now();
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
    } catch {
      // ignore corrupted metadata
    }
  }
  return projectPath;
}

export function duplicateProject(
  baseDir: string,
  name: string,
  newName: string
): void {
  const src = path.join(baseDir, name);
  const dest = path.join(baseDir, newName);
  fs.cpSync(src, dest, { recursive: true });
  const metaPath = path.join(dest, 'project.json');
  if (fs.existsSync(metaPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      const meta = ProjectMetadataSchema.parse(data);
      meta.name = newName;
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
    } catch {
      // ignore malformed metadata
    }
  }
}

export function deleteProject(baseDir: string, name: string): void {
  const dir = path.join(baseDir, name);
  fs.rmSync(dir, { recursive: true, force: true });
}

export async function importProject(baseDir: string): Promise<void> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  if (canceled || filePaths.length === 0) return;
  const src = filePaths[0];
  const dest = path.join(baseDir, path.basename(src));
  fs.cpSync(src, dest, { recursive: true });
}

export function registerProjectHandlers(
  baseDir: string,
  onOpen: (path: string) => void
): void {
  ipcMain.handle('list-projects', () => listProjects(baseDir));
  ipcMain.handle('list-versions', () => listVersions());
  ipcMain.handle('create-project', (_e, name: string, version: string) => {
    createProject(baseDir, name, version);
  });
  ipcMain.handle('open-project', async (_e, name: string) => {
    const projectPath = openProject(baseDir, name);
    await setActiveProject(projectPath);
    onOpen(projectPath);
  });
  ipcMain.handle('duplicate-project', (_e, name: string, newName: string) => {
    duplicateProject(baseDir, name, newName);
  });
  ipcMain.handle('delete-project', (_e, name: string) => {
    deleteProject(baseDir, name);
  });
  ipcMain.handle('import-project', async () => {
    await importProject(baseDir);
  });
}
