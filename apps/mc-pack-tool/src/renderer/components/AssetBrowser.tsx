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
    <ul className="list-disc pl-4">
      {/* Render the list of files */}
      {files.map((f) => {
        const full = path.join(projectPath, f);
        const name = path.basename(f);
        let thumb: string | null = null;
        if (f.endsWith('.png')) {
          const rel = f.split(path.sep).join('/');
          thumb = `ptex://${rel}`;
        }
        const openFile = () => window.electronAPI?.openFile(full);
        const openFolder = () => window.electronAPI?.openInFolder(full);
        return (
          <li key={f} className="flex items-center space-x-2">
            {thumb && <img src={thumb} alt={name} className="w-8 h-8" />}
            <span>{name}</span>
            <button className="underline text-blue-600" onClick={openFile}>
              Open
            </button>
            <button className="underline text-blue-600" onClick={openFolder}>
              Show
            </button>
          </li>
        );
      })}
    </ul>
  );
};
export default AssetBrowser;
