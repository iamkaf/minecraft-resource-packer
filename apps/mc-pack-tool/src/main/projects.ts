import fs from 'fs';
import path from 'path';
import { ProjectMetadata } from '../minecraft/project';
import { generatePackIcon, writeSettings } from './icon';

export async function createProject(
  baseDir: string,
  name: string,
  version: string
): Promise<void> {
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
  const seed = Math.floor(Math.random() * 1e9);
  await generatePackIcon(seed, path.join(dir, 'pack.png'));
  writeSettings(dir, { iconSeed: seed });
}
