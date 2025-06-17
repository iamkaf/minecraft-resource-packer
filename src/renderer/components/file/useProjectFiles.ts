import { useEffect, useState } from 'react';
import { useToast } from '../providers/ToastProvider';
import { useProject } from '../providers/ProjectProvider';

export function useProjectFiles() {
  const { path: projectPath } = useProject();
  const [files, setFiles] = useState<string[]>([]);
  const [noExport, setNoExport] = useState<Set<string>>(new Set());
  const [versions, setVersions] = useState<Record<string, number>>({});
  const toast = useToast();

  useEffect(() => {
    let alive = true;
    window.electronAPI
      ?.watchProject(projectPath)
      .then((list) => {
        if (alive && list) setFiles(list);
      })
      .catch(() => {
        /* ignore */
      });
    const add = (_e: unknown, p: string) => setFiles((f) => [...f, p]);
    const remove = (_e: unknown, p: string) =>
      setFiles((f) => f.filter((x) => x !== p));
    const rename = (_e: unknown, args: { oldPath: string; newPath: string }) =>
      setFiles((f) => f.map((x) => (x === args.oldPath ? args.newPath : x)));
    const change = (_e: unknown, args: { path: string; stamp: number }) =>
      setVersions((v) => ({ ...v, [args.path]: args.stamp }));
    window.electronAPI?.onFileAdded(add);
    window.electronAPI?.onFileRemoved(remove);
    window.electronAPI?.onFileRenamed(rename);
    window.electronAPI?.onFileChanged(change);
    return () => {
      alive = false;
      window.electronAPI?.unwatchProject(projectPath);
    };
  }, [projectPath]);

  useEffect(() => {
    let active = true;
    window.electronAPI?.getNoExport(projectPath).then((list) => {
      if (active && list) setNoExport(new Set(list));
    });
    return () => {
      active = false;
    };
  }, [projectPath]);

  const toggleNoExport = (list: string[], flag: boolean) => {
    window.electronAPI?.setNoExport(projectPath, list, flag);
    setNoExport((prev) => {
      const ns = new Set(prev);
      list.forEach((file) => {
        if (flag) ns.add(file);
        else ns.delete(file);
      });
      return ns;
    });
    toast({
      message: flag
        ? `${list.length} file(s) added to No Export`
        : `${list.length} file(s) removed from No Export`,
      type: 'info',
    });
  };

  return { files, noExport, toggleNoExport, versions };
}
