import React, { useEffect, useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useToast } from '../components/ToastProvider';
import ExternalLink from '../components/ExternalLink';
import ProjectSidebar from '../components/ProjectSidebar';
import ProjectForm from '../components/project/ProjectForm';
import ProjectTable, { ProjectInfo } from '../components/project/ProjectTable';
import { useProjectModals } from '../components/project/ProjectModals';
import SearchToolbar from '../components/project/SearchToolbar';
import BulkExportModal, { BulkProgress } from '../components/BulkExportModal';

// Lists all available projects and lets the user open them.

const ProjectManagerView: React.FC = () => {
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [sortKey, setSortKey] = useState<keyof ProjectInfo>('name');
  const [asc, setAsc] = useState(true);
  const [versions, setVersions] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [filterVersion, setFilterVersion] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<BulkProgress | null>(null);

  const toast = useToast();

  const refresh = () => {
    window.electronAPI?.listProjects().then(setProjects);
  };

  useEffect(() => {
    refresh();
    window.electronAPI?.listVersions().then(setVersions);
  }, []);

  const { modals, openDuplicate, openDelete } = useProjectModals(
    refresh,
    toast
  );

  const handleOpen = (n: string) => {
    window.electronAPI?.openProject(n);
  };

  const handleImport = () => {
    window.electronAPI?.importProject().then(refresh);
  };

  const handleCreate = (name: string, version: string) => {
    window.electronAPI?.createProject(name, version).then(() => {
      refresh();
      toast('Project created', 'success');
    });
  };

  const handleSort = (key: keyof ProjectInfo) => {
    if (sortKey === key) {
      setAsc(!asc);
    } else {
      setSortKey(key);
      setAsc(true);
    }
  };

  const handleBulkExport = () => {
    if (selected.size === 0) return;
    setProgress({ current: 0, total: selected.size });
    window.electronAPI
      ?.exportProjects(Array.from(selected))
      .then(() => {
        toast('Bulk export complete', 'success');
        setSelected(new Set());
      })
      .catch(() => toast('Bulk export failed', 'error'))
      .finally(() => setProgress(null));
  };

  const chipVersions = useMemo(
    () => Array.from(new Set(projects.map((p) => p.version))),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    let list = projects;
    if (filterVersion) list = list.filter((p) => p.version === filterVersion);
    if (search) {
      const fuse = new Fuse(list, { keys: ['name'], threshold: 0.4 });
      list = fuse.search(search).map((r) => r.item);
    }
    return list;
  }, [projects, filterVersion, search]);

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const dir = asc ? 1 : -1;
    if (a[sortKey] < b[sortKey]) return -1 * dir;
    if (a[sortKey] > b[sortKey]) return 1 * dir;
    return 0;
  });

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelected(new Set(sortedProjects.map((p) => p.name)));
    } else {
      setSelected(new Set());
    }
  };

  const handleSelect = (name: string, checked: boolean) => {
    const ns = new Set(selected);
    if (checked) ns.add(name);
    else ns.delete(name);
    setSelected(ns);
  };

  return (
    <section className="flex gap-4">
      <div className="flex-1">
        <div className="flex items-center mb-2 gap-2">
          <h2 className="font-display text-xl flex-1">Projects</h2>
          <ExternalLink
            href="https://minecraft.wiki/w/Tutorials/Creating_a_resource_pack"
            aria-label="Help"
            className="btn btn-circle btn-ghost btn-sm"
          >
            ?
          </ExternalLink>
        </div>
        <ProjectForm
          versions={versions}
          onCreate={handleCreate}
          onImport={handleImport}
        />
        <SearchToolbar
          search={search}
          onSearchChange={setSearch}
          versions={chipVersions}
          activeVersion={filterVersion}
          onToggleVersion={(v) =>
            setFilterVersion(filterVersion === v ? null : v)
          }
          onBulkExport={handleBulkExport}
          disableExport={selected.size === 0}
        />
        <ProjectTable
          projects={sortedProjects}
          onSort={handleSort}
          selected={selected}
          onSelect={handleSelect}
          onSelectAll={toggleAll}
          onOpen={handleOpen}
          onDuplicate={openDuplicate}
          onDelete={openDelete}
          onRowClick={setActiveProject}
        />
        {progress && <BulkExportModal progress={progress} />}
        {modals}
      </div>
      <ProjectSidebar project={activeProject} />
    </section>
  );
};
export default ProjectManagerView;
