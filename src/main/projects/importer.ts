/**
 * Functions related to importing external resource packs as new projects.
 */
import fs from 'fs';
import path from 'path';
import { dialog } from 'electron';
import unzipper from 'unzipper';
import {
  createDefaultProjectMeta,
  type ProjectMetadata,
} from '../../shared/project';
import { readProjectMeta, writeProjectMeta } from '../projectMeta';
import { versionForFormat } from '../../shared/packFormat';

export interface ImportSummary {
  name: string;
  fileCount: number;
  durationMs: number;
}

async function extractZip(src: string, dest: string): Promise<number> {
  let count = 0;
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(src)
      .pipe(unzipper.Parse())
      .on('entry', (entry: unknown) => {
        const e = entry as {
          type: string;
          path: string;
          autodrain(): void;
          pipe(dest: fs.WriteStream): void;
        };
        const outPath = path.join(dest, e.path);
        if (e.type === 'Directory') {
          fs.mkdirSync(outPath, { recursive: true });
          e.autodrain();
        } else {
          fs.mkdirSync(path.dirname(outPath), { recursive: true });
          e.pipe(fs.createWriteStream(outPath));
          count++;
        }
      })
      .on('close', resolve)
      .on('error', reject);
  });
  return count;
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

export async function importProject(
  baseDir: string
): Promise<ImportSummary | null> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Resource Packs', extensions: ['zip'] }],
  });
  if (canceled || filePaths.length === 0) return null;
  const src = filePaths[0];
  if (path.extname(src).toLowerCase() !== '.zip') return null;
  const name = path.basename(src, '.zip');
  const dest = path.join(baseDir, name);
  const start = Date.now();
  await fs.promises.mkdir(dest, { recursive: true });
  const fileCount = await extractZip(src, dest);
  const version = (await detectVersion(dest)) ?? 'unknown';
  let meta: ProjectMetadata;
  if (fs.existsSync(path.join(dest, 'project.json'))) {
    try {
      meta = await readProjectMeta(dest);
    } catch {
      meta = createDefaultProjectMeta(name, version);
    }
  } else {
    meta = createDefaultProjectMeta(name, version);
  }
  meta.minecraft_version = version;
  await writeProjectMeta(dest, meta);
  const durationMs = Date.now() - start;
  return { name, fileCount, durationMs };
}
