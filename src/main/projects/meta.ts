/**
 * Load and save pack metadata stored in a project's project.json file.
 */
import fs from 'fs';
import path from 'path';
import type { PackMeta, ProjectMetadata } from '../../shared/project';
import { PackMetaSchema, createDefaultProjectMeta } from '../../shared/project';
import { readProjectMeta, writeProjectMeta } from '../projectMeta';
import logger from '../logger';

export async function loadPackMeta(
  baseDir: string,
  name: string
): Promise<PackMeta> {
  const projectPath = path.join(baseDir, name);
  if (fs.existsSync(path.join(projectPath, 'project.json'))) {
    try {
      const meta = await readProjectMeta(projectPath);
      return PackMetaSchema.parse(meta);
    } catch (e) {
      logger.error(
        `Failed to load pack metadata from ${path.join(
          projectPath,
          'project.json'
        )}: ${e}`
      );
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
    } catch (e) {
      logger.error(
        `Failed to read existing metadata from ${path.join(
          projectPath,
          'project.json'
        )}: ${e}`
      );
    }
  }
  if (!data) {
    data = createDefaultProjectMeta(name, 'unknown');
    data.version = meta.version ?? 'unknown';
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
