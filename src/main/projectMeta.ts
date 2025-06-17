import fs from 'fs';
import path from 'path';
import { ProjectMetadata, ProjectMetadataSchema } from '../shared/project';

/** Read and parse the project.json metadata for a project. */
export async function readProjectMeta(
  projectPath: string
): Promise<ProjectMetadata> {
  const p = path.join(projectPath, 'project.json');
  const data = JSON.parse(await fs.promises.readFile(p, 'utf-8'));
  return ProjectMetadataSchema.parse(data);
}

/** Write the given metadata to project.json. */
export async function writeProjectMeta(
  projectPath: string,
  meta: ProjectMetadata
): Promise<void> {
  const p = path.join(projectPath, 'project.json');
  await fs.promises.writeFile(p, JSON.stringify(meta, null, 2));
}
