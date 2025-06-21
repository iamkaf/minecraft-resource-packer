/**
 * Project manager utilities for listing, creating and modifying projects on disk.
 */
import fs from 'fs';
import path from 'path';
import { generatePackIcon } from '../icon';
import {
  createDefaultProjectMeta,
  type ProjectMetadata,
} from '../../shared/project';
import { readProjectMeta, writeProjectMeta } from '../projectMeta';
import logger from '../logger';

export interface ProjectInfo {
  name: string;
  version: string;
  assets: number;
  lastOpened: number;
}

export async function createProject(
  baseDir: string,
  name: string,
  minecraftVersion: string
): Promise<void> {
  const dir = path.join(baseDir, name);
  if (!fs.existsSync(dir)) await fs.promises.mkdir(dir, { recursive: true });
  const meta: ProjectMetadata = createDefaultProjectMeta(
    name,
    minecraftVersion
  );
  await fs.promises.writeFile(
    path.join(dir, 'project.json'),
    JSON.stringify(meta, null, 2)
  );
  await generatePackIcon(dir);
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
      } catch (e) {
        logger.error(`listProjects failed for ${name}: ${e}`);
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
    } catch (e) {
      logger.error(
        `Failed to update ${path.join(projectPath, 'project.json')}: ${e}`
      );
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
    } catch (e) {
      logger.error(
        `Failed to update duplicated project metadata ${path.join(
          dest,
          'project.json'
        )}: ${e}`
      );
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
    } catch (e) {
      logger.error(
        `Failed to update renamed project metadata ${path.join(
          dest,
          'project.json'
        )}: ${e}`
      );
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
