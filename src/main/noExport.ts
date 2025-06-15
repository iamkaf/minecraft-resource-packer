import fs from 'fs';
import path from 'path';
import type { IpcMain } from 'electron';
import { PackFileSchema, type PackFile } from '../shared/project';

async function readMeta(projectPath: string): Promise<PackFile> {
  const p = path.join(projectPath, 'pack.json');
  const data = JSON.parse(await fs.promises.readFile(p, 'utf-8'));
  return PackFileSchema.parse(data);
}

async function writeMeta(projectPath: string, meta: PackFile): Promise<void> {
  const p = path.join(projectPath, 'pack.json');
  await fs.promises.writeFile(p, JSON.stringify(meta, null, 2));
}

export async function getNoExport(projectPath: string): Promise<string[]> {
  try {
    const meta = await readMeta(projectPath);
    return meta.noExport ?? [];
  } catch {
    return [];
  }
}

export async function setNoExport(
  projectPath: string,
  files: string[],
  flag: boolean
): Promise<void> {
  const meta = await readMeta(projectPath);
  const set = new Set(meta.noExport ?? []);
  for (const f of files) {
    if (flag) set.add(f);
    else set.delete(f);
  }
  meta.noExport = Array.from(set);
  await writeMeta(projectPath, meta);
}

export function registerNoExportHandlers(ipc: IpcMain) {
  ipc.handle('get-no-export', (_e, project: string) => getNoExport(project));
  ipc.handle(
    'set-no-export',
    (_e, project: string, files: string[], flag: boolean) =>
      setNoExport(project, files, flag)
  );
}
