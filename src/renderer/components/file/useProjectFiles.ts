import { useEffect, useState } from 'react';
import { useToast } from '../providers/ToastProvider';
import { useAppStore, AppState } from '../../store';

export function useProjectFiles() {
  const projectPath = useAppStore((s) => s.projectPath)!;
  const [files, setFiles] = useState<string[]>([]);
  const [versions, setVersions] = useState<Record<string, number>>({});
  const { noExport } = useAppStore.getState();
  const toast = useToast();

  useEffect(() => {
    // Certain paths should never appear in the asset browser or trigger file
    // events, namely revision history and the project's metadata file.
    const isIgnored = (p: string) =>
      p === '.history' ||
      p.startsWith('.history/') ||
      p.includes('/.history/') ||
      p === 'project.json';
    let alive = true;
    window.electronAPI
      ?.watchProject(projectPath)
      .then((list) => {
        if (alive && list) {
          const filtered = list.filter((p) => !isIgnored(p));
          setFiles(filtered);
        }
      })
      .catch(() => {
        /* ignore */
      });
    const add = (_e: unknown, p: string) => {
      if (isIgnored(p)) return;
      setFiles((f) => [...f, p]);
    };
    const remove = (_e: unknown, p: string) => {
      if (isIgnored(p)) return;
      setFiles((f) => f.filter((x) => x !== p));
    };
    const rename = (
      _e: unknown,
      args: { oldPath: string; newPath: string }
    ) => {
      if (isIgnored(args.oldPath) || isIgnored(args.newPath)) return;
      setFiles((f) => f.map((x) => (x === args.oldPath ? args.newPath : x)));
    };
    const change = (_e: unknown, args: { path: string; stamp: number }) => {
      if (isIgnored(args.path)) return;
      setVersions((v) => ({ ...v, [args.path]: args.stamp }));
    };
    const offAdd = window.electronAPI?.onFileAdded(add);
    const offRemove = window.electronAPI?.onFileRemoved(remove);
    const offRename = window.electronAPI?.onFileRenamed(rename);
    const offChange = window.electronAPI?.onFileChanged(change);
    return () => {
      alive = false;
      window.electronAPI?.unwatchProject(projectPath);
      offAdd?.();
      offRemove?.();
      offRename?.();
      offChange?.();
    };
  }, [projectPath]);

  useEffect(() => {
    let active = true;
    window.electronAPI?.getNoExport(projectPath).then((list) => {
      if (active && list) useAppStore.setState({ noExport: new Set(list) });
    });
    return () => {
      active = false;
    };
  }, [projectPath]);

  const toggleNoExport = (list: string[], flag: boolean) => {
    window.electronAPI?.setNoExport(projectPath, list, flag);
    useAppStore.setState((state) => {
      const ns = new Set(state.noExport);
      list.forEach((file) => {
        if (flag) ns.add(file);
        else ns.delete(file);
      });
      return { noExport: ns } as Partial<AppState>;
    });
    toast({
      message: flag
        ? `${list.length} file(s) added to No Export`
        : `${list.length} file(s) removed from No Export`,
      type: 'info',
    });
  };

  return {
    files,
    noExport: useAppStore.getState().noExport,
    toggleNoExport,
    versions,
  };
}
