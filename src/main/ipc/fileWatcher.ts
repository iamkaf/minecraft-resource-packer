import type { IpcMain } from 'electron';
import { BrowserWindow } from 'electron';
import { watch, FSWatcher } from 'chokidar';
import fs from 'fs';
import path from 'path';

let win: BrowserWindow | null = null;
const watchers = new Map<string, FSWatcher>();

async function listFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const walk = async (d: string, prefix = '') => {
    const entries = await fs.promises.readdir(d, { withFileTypes: true });
    for (const entry of entries) {
      const rel = path.join(prefix, entry.name);
      if (entry.isDirectory()) {
        await walk(path.join(d, entry.name), rel);
      } else {
        files.push(rel.split(path.sep).join('/'));
      }
    }
  };
  await walk(dir);
  return files;
}

export function registerFileWatcherHandlers(
  ipc: IpcMain,
  window: BrowserWindow
) {
  win = window;
  ipc.handle('watch-project', async (_e, projectPath: string) => {
    if (!watchers.has(projectPath)) {
      const watcher = watch(projectPath, { ignoreInitial: true });
      watcher.on('add', (file) => {
        win?.webContents.send(
          'file-added',
          path.relative(projectPath, file).split(path.sep).join('/')
        );
      });
      watcher.on('unlink', (file) => {
        win?.webContents.send(
          'file-removed',
          path.relative(projectPath, file).split(path.sep).join('/')
        );
      });
      watcher.on('change', (file) => {
        win?.webContents.send('file-changed', {
          path: path.relative(projectPath, file).split(path.sep).join('/'),
          stamp: Date.now(),
        });
      });
      watchers.set(projectPath, watcher);
    }
    return listFiles(projectPath);
  });

  ipc.handle('unwatch-project', async (_e, projectPath: string) => {
    const watcher = watchers.get(projectPath);
    if (watcher) {
      await watcher.close();
      watchers.delete(projectPath);
    }
  });
}

export function emitRenamed(oldPath: string, newPath: string) {
  if (!win) return;
  for (const projectPath of watchers.keys()) {
    if (oldPath.startsWith(projectPath) && newPath.startsWith(projectPath)) {
      win.webContents.send('file-renamed', {
        oldPath: path.relative(projectPath, oldPath).split(path.sep).join('/'),
        newPath: path.relative(projectPath, newPath).split(path.sep).join('/'),
      });
    }
  }
}
