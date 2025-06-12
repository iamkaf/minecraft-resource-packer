import React, { useEffect, useState } from 'react';
import { watch } from 'chokidar';
import fs from 'fs';
import path from 'path';

// Simple file list that updates whenever files inside the project directory
// change on disk. Uses chokidar to watch for edits and re-read the directory.

interface Props {
  path: string;
}

const AssetBrowser: React.FC<Props> = ({ path: projectPath }) => {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const loadFiles = () => {
      const out: string[] = [];
      const walk = (dir: string, prefix = '') => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const rel = path.join(prefix, entry.name);
          if (entry.isDirectory()) {
            walk(path.join(dir, entry.name), rel);
          } else {
            out.push(rel.split(path.sep).join('/'));
          }
        }
      };
      walk(projectPath);
      setFiles(out);
    };

    // Initial load and set up a watcher for future changes.
    loadFiles();
    const watcher = watch(projectPath, { ignoreInitial: true });
    watcher.on('all', loadFiles);
    return () => {
      void watcher.close();
    };
  }, [projectPath]);

  return (
    <div className="grid grid-cols-6 gap-2">
      {files.map((f) => {
        const full = path.join(projectPath, f);
        const name = path.basename(f);
        let thumb: string | null = null;
        if (f.endsWith('.png')) {
          const rel = f.split(path.sep).join('/');
          thumb = `ptex://${rel}`;
        }
        const openFolder = () => window.electronAPI?.openInFolder(full);
        const openFile = () => window.electronAPI?.openFile(full);
        return (
          <div
            key={f}
            className="p-1 cursor-pointer hover:ring ring-accent"
            onDoubleClick={openFile}
            onContextMenu={(e) => {
              e.preventDefault();
              openFolder();
            }}
          >
            {thumb ? (
              <img src={thumb} alt={name} className="w-full aspect-square" />
            ) : (
              <div className="w-full aspect-square bg-base-300 flex items-center justify-center">
                {name}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default AssetBrowser;
