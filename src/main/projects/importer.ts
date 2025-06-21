/**
 * Functions related to importing external resource packs as new projects.
 */
import fs from 'fs';
import path from 'path';
import { dialog } from 'electron';
import unzipper from 'unzipper';
import { pipeline } from 'stream/promises';
import {
  createDefaultProjectMeta,
  type ProjectMetadata,
} from '../../shared/project';
import { readProjectMeta, writeProjectMeta } from '../projectMeta';
import { versionForFormat } from '../../shared/packFormat';
import logger from '../logger';

export interface ImportSummary {
  name: string;
  fileCount: number;
  durationMs: number;
}

async function extractZip(src: string, dest: string): Promise<number> {
  let count = 0;
  const directory = await unzipper.Open.file(src);
  for (const e of directory.files) {
    const outPath = path.resolve(dest, e.path);
    if (!outPath.startsWith(dest)) {
      // ignore zip slip entries
      continue;
    }
    if (e.type === 'Directory') {
      await fs.promises.mkdir(outPath, { recursive: true });
    } else {
      await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
      await pipeline(e.stream(), fs.createWriteStream(outPath));
      count++;
    }
  }
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
  } catch (e) {
    logger.error(`Failed to parse ${mcmeta}: ${e}`);
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
    } catch (e) {
      logger.error(
        `Failed to parse ${path.join(dest, 'project.json')} during import: ${e}`
      );
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
