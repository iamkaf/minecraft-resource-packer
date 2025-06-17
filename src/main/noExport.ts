import type { IpcMain } from 'electron';
import { readProjectMeta, writeProjectMeta } from './projectMeta';

export async function getNoExport(projectPath: string): Promise<string[]> {
  try {
    const meta = await readProjectMeta(projectPath);
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
  const meta = await readProjectMeta(projectPath);
  const set = new Set(meta.noExport ?? []);
  for (const f of files) {
    if (flag) set.add(f);
    else set.delete(f);
  }
  meta.noExport = Array.from(set);
  await writeProjectMeta(projectPath, meta);
}

export function registerNoExportHandlers(ipc: IpcMain) {
  ipc.handle('get-no-export', (_e, project: string) => getNoExport(project));
  ipc.handle(
    'set-no-export',
    (_e, project: string, files: string[], flag: boolean) =>
      setNoExport(project, files, flag)
  );
}
