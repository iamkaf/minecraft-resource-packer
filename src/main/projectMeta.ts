import fs from 'fs';
import path from 'path';
import { ProjectMetadata, ProjectMetadataSchema } from '../shared/project';
import logger from './logger';

/** Read and parse the project.json metadata for a project. */
export async function readProjectMeta(
  projectPath: string
): Promise<ProjectMetadata> {
  const p = path.join(projectPath, 'project.json');
  const data = JSON.parse(await fs.promises.readFile(p, 'utf-8'));
  return ProjectMetadataSchema.parse(data);
}

/**
 * Read project.json if present, returning undefined when the file cannot be
 * parsed. This helper avoids scattered try/catch blocks around metadata reads.
 */
export async function readProjectMetaSafe(
  projectPath: string
): Promise<ProjectMetadata | undefined> {
  try {
    return await readProjectMeta(projectPath);
  } catch (e) {
    logger.error(
      `Failed to parse ${path.join(projectPath, 'project.json')}: ${e}`
    );
    return undefined;
  }
}

/** Write the given metadata to project.json. */
export async function writeProjectMeta(
  projectPath: string,
  meta: ProjectMetadata
): Promise<void> {
  const p = path.join(projectPath, 'project.json');
  await fs.promises.writeFile(p, JSON.stringify(meta, null, 2));
}
