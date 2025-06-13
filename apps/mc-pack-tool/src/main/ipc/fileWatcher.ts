import { ipcMain, BrowserWindow } from 'electron';
import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';

let win: BrowserWindow | null = null;
const watchers = new Map<string, chokidar.FSWatcher>();

function listFiles(dir: string): string[] {
  const files: string[] = [];
  const walk = (d: string, prefix = '') => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const rel = path.join(prefix, entry.name);
      if (entry.isDirectory()) {
        walk(path.join(d, entry.name), rel);
      } else {
        files.push(rel.split(path.sep).join('/'));
      }
    }
  };
  walk(dir);
  return files;
}

export function registerFileWatcherHandlers(window: BrowserWindow) {
  win = window;
  ipcMain.handle('watch-project', (_e, projectPath: string) => {
    if (!watchers.has(projectPath)) {
      const watcher = chokidar.watch(projectPath, { ignoreInitial: true });
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
      watchers.set(projectPath, watcher);
    }
    return listFiles(projectPath);
  });

  ipcMain.handle('unwatch-project', async (_e, projectPath: string) => {
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
