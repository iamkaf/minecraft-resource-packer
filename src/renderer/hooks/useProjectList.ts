import { useEffect, useState, useCallback } from 'react';
import type { FormatOption } from '../components/project/ProjectForm';
import type { ProjectInfo } from '../components/project/ProjectTable';

export default function useProjectList() {
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [formats, setFormats] = useState<FormatOption[]>([]);
  const [sortKey, setSortKey] = useState<keyof ProjectInfo>('name');
  const [asc, setAsc] = useState(true);

  const refresh = useCallback(() => {
    window.electronAPI?.listProjects().then(setProjects);
  }, []);

  useEffect(() => {
    refresh();
    window.electronAPI?.listPackFormats().then(setFormats);
    window.electronAPI?.getProjectSort().then((s) => {
      if (s) {
        setSortKey(s.key);
        setAsc(s.asc);
      }
    });
  }, [refresh]);

  const handleSort = useCallback(
    (key: keyof ProjectInfo) => {
      if (sortKey === key) {
        const next = !asc;
        setAsc(next);
        window.electronAPI?.setProjectSort(sortKey, next);
      } else {
        setSortKey(key);
        setAsc(true);
        window.electronAPI?.setProjectSort(key, true);
      }
    },
    [sortKey, asc]
  );

  return {
    projects,
    formats,
    sortKey,
    asc,
    refresh,
    handleSort,
  };
}
