import fs from 'fs';
import path from 'path';
import { ProjectMetadata } from "../minecraft/project";

export function createProject(baseDir: string, name: string, version: string): void {
  const dir = path.join(baseDir, name);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const meta: ProjectMetadata = { name, version, assets: [] };
  fs.writeFileSync(path.join(dir, "project.json"), JSON.stringify(meta, null, 2));
}
