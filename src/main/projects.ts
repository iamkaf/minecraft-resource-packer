import fs from 'fs';
import path from 'path';
import type { IpcMain } from 'electron';
import { dialog } from 'electron';
import type { ProjectMetadata, PackMeta } from '../shared/project';
import { PackMetaSchema } from '../shared/project';
import { readProjectMeta, writeProjectMeta } from './projectMeta';
import { listPackFormats, setActiveProject } from './assets';
import { setLastProject } from './layout';
import unzipper from 'unzipper';
import { versionForFormat } from '../shared/packFormat';

// Re-export PackMeta so renderer and preload can import the type from this file
export type { PackMeta } from '../shared/project';
import { generatePackIcon } from './icon';

export interface ImportSummary {
  name: string;
  fileCount: number;
  durationMs: number;
}

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
    const metaPath = path.join(baseDir, name);
    if (fs.existsSync(path.join(metaPath, 'project.json'))) {
      try {
        const meta = await readProjectMeta(metaPath);
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
  if (fs.existsSync(path.join(projectPath, 'project.json'))) {
    try {
      const meta = await readProjectMeta(projectPath);
      meta.lastOpened = Date.now();
      await writeProjectMeta(projectPath, meta);
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
  if (fs.existsSync(path.join(dest, 'project.json'))) {
    try {
      const meta = await readProjectMeta(dest);
      meta.name = newName;
      await writeProjectMeta(dest, meta);
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
  if (fs.existsSync(path.join(dest, 'project.json'))) {
    try {
      const meta = await readProjectMeta(dest);
      meta.name = newName;
      await writeProjectMeta(dest, meta);
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

async function extractZip(src: string, dest: string): Promise<number> {
  let count = 0;
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(src)
      .pipe(unzipper.Parse())
      .on('entry', (entry: any) => {
        const outPath = path.join(dest, entry.path);
        if (entry.type === 'Directory') {
          fs.mkdirSync(outPath, { recursive: true });
          entry.autodrain();
        } else {
          fs.mkdirSync(path.dirname(outPath), { recursive: true });
          entry.pipe(fs.createWriteStream(outPath));
          count++;
        }
      })
      .on('close', resolve)
      .on('error', reject);
  });
  return count;
}

function defaultMeta(name: string, version: string): ProjectMetadata {
  return {
    name,
    minecraft_version: version,
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
}

async function detectVersion(dir: string): Promise<string | null> {
  const mcmeta = path.join(dir, 'pack.mcmeta');
  if (!fs.existsSync(mcmeta)) return null;
  try {
    const data = JSON.parse(await fs.promises.readFile(mcmeta, 'utf-8'));
    const fmt = data?.pack?.pack_format;
    if (typeof fmt === 'number') {
      return versionForFormat(fmt);
    }
  } catch {
    /* ignore */
  }
  return null;
}

async function countFiles(dir: string): Promise<number> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  let total = 0;
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      total += await countFiles(full);
    } else {
      total++;
    }
  }
  return total;
}

export async function importProject(
  baseDir: string
): Promise<ImportSummary | null> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory'],
    filters: [{ name: 'Resource Packs', extensions: ['zip'] }],
  });
  if (canceled || filePaths.length === 0) return null;
  const src = filePaths[0];
  const ext = path.extname(src).toLowerCase();
  const name = ext === '.zip' ? path.basename(src, ext) : path.basename(src);
  const dest = path.join(baseDir, name);
  const start = Date.now();
  let fileCount = 0;
  if (ext === '.zip') {
    await fs.promises.mkdir(dest, { recursive: true });
    fileCount = await extractZip(src, dest);
    const version = (await detectVersion(dest)) ?? 'unknown';
    let meta: ProjectMetadata;
    if (fs.existsSync(path.join(dest, 'project.json'))) {
      try {
        meta = await readProjectMeta(dest);
      } catch {
        meta = defaultMeta(name, version);
      }
    } else {
      meta = defaultMeta(name, version);
    }
    meta.minecraft_version = version;
    await writeProjectMeta(dest, meta);
  } else {
    await fs.promises.cp(src, dest, { recursive: true });
    fileCount = await countFiles(dest);
  }
  const durationMs = Date.now() - start;
  return { name, fileCount, durationMs };
}

export async function loadPackMeta(
  baseDir: string,
  name: string
): Promise<PackMeta> {
  const projectPath = path.join(baseDir, name);
  if (fs.existsSync(path.join(projectPath, 'project.json'))) {
    try {
      const meta = await readProjectMeta(projectPath);
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
  const projectPath = path.join(baseDir, name);
  let data: ProjectMetadata | null = null;
  if (fs.existsSync(path.join(projectPath, 'project.json'))) {
    try {
      data = await readProjectMeta(projectPath);
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
  await writeProjectMeta(projectPath, data);
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
    return importProject(baseDir);
  });
  ipc.handle('load-pack-meta', (_e, name: string) => {
    return loadPackMeta(baseDir, name);
  });
  ipc.handle('save-pack-meta', (_e, name: string, meta: PackMeta) => {
    return savePackMeta(baseDir, name, meta);
  });
}
