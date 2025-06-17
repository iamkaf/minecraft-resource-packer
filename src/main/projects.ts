import fs from 'fs';
import path from 'path';
import type { IpcMain } from 'electron';
import { dialog } from 'electron';
import unzipper from 'unzipper';
import {
  ProjectMetadata,
  ProjectMetadataSchema,
  PackMeta,
  PackMetaSchema,
} from '../shared/project';
import { listPackFormats, setActiveProject } from './assets';
import { setLastProject } from './layout';

// Re-export PackMeta so renderer and preload can import the type from this file
export type { PackMeta } from '../shared/project';
import { generatePackIcon } from './icon';

export async function createProject(
  baseDir: string,
  name: string,
  minecraftVersion: string
): Promise<void> {
  const dir = path.join(baseDir, name);
  if (!fs.existsSync(dir)) await fs.promises.mkdir(dir, { recursive: true });
  const meta: ProjectMetadata = {
    name,
    minecraft_version: minecraftVersion,
    version: '1.0.0',
    assets: [],
    noExport: [],
    lastOpened: Date.now(),
    description: '',
    author: '',
    urls: [],
    created: Date.now(),
    license: '',
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
          version: meta.minecraft_version,
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

export async function renameProject(
  baseDir: string,
  name: string,
  newName: string
): Promise<void> {
  const src = path.join(baseDir, name);
  const dest = path.join(baseDir, newName);
  await fs.promises.rename(src, dest);
  const metaPath = path.join(dest, 'project.json');
  if (fs.existsSync(metaPath)) {
    try {
      const data = JSON.parse(await fs.promises.readFile(metaPath, 'utf-8'));
      const meta = ProjectMetadataSchema.parse(data);
      meta.name = newName;
      await fs.promises.writeFile(metaPath, JSON.stringify(meta, null, 2));
    } catch {
      /* ignore */
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
    properties: ['openFile', 'openDirectory'],
    filters: [{ name: 'Resource Pack', extensions: ['zip'] }],
  });
  if (canceled || filePaths.length === 0) return;
  const src = filePaths[0];
  const stat = await fs.promises.stat(src);
  const name = path.basename(src, stat.isDirectory() ? '' : path.extname(src));
  const dest = path.join(baseDir, name);
  if (stat.isDirectory()) {
    await fs.promises.cp(src, dest, { recursive: true });
  } else if (src.endsWith('.zip')) {
    await fs.promises.mkdir(dest, { recursive: true });
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(src)
        .pipe(unzipper.Extract({ path: dest }))
        .on('close', resolve)
        .on('error', reject);
    });
  }
}

export async function loadPackMeta(
  baseDir: string,
  name: string
): Promise<PackMeta> {
  const metaPath = path.join(baseDir, name, 'project.json');
  if (fs.existsSync(metaPath)) {
    try {
      const data = JSON.parse(await fs.promises.readFile(metaPath, 'utf-8'));
      const meta = ProjectMetadataSchema.parse(data);
      return PackMetaSchema.parse(meta);
    } catch {
      // ignore malformed data
    }
  }
  return {
    version: 'unknown',
    description: '',
    author: '',
    urls: [],
    created: Date.now(),
    license: '',
  };
}

export async function savePackMeta(
  baseDir: string,
  name: string,
  meta: PackMeta
): Promise<void> {
  const metaPath = path.join(baseDir, name, 'project.json');
  let data: ProjectMetadata | null = null;
  if (fs.existsSync(metaPath)) {
    try {
      const raw = JSON.parse(await fs.promises.readFile(metaPath, 'utf-8'));
      data = ProjectMetadataSchema.parse(raw);
    } catch {
      /* ignore */
    }
  }
  if (!data) {
    data = {
      name,
      minecraft_version: 'unknown',
      version: meta.version ?? 'unknown',
      assets: [],
      noExport: [],
      lastOpened: Date.now(),
      description: '',
      author: '',
      urls: [],
      created: Date.now(),
      license: '',
    };
  }
  if (meta.version) data.version = meta.version;
  data.description = meta.description;
  data.author = meta.author;
  data.urls = meta.urls;
  data.license = meta.license;
  if (!data.created) data.created = Date.now();
  data.updated = Date.now();
  await fs.promises.writeFile(metaPath, JSON.stringify(data, null, 2));
}

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
    setLastProject(name);
    await setActiveProject(projectPath);
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
  ipc.handle('import-project', async () => {
    await importProject(baseDir);
  });
  ipc.handle('load-pack-meta', (_e, name: string) => {
    return loadPackMeta(baseDir, name);
  });
  ipc.handle('save-pack-meta', (_e, name: string, meta: PackMeta) => {
    return savePackMeta(baseDir, name, meta);
  });
}
