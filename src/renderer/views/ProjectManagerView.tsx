import React, { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { useToast } from '../components/providers/ToastProvider';
import ExternalLink from '../components/common/ExternalLink';
import ProjectInfoPanel from '../components/project/ProjectInfoPanel';
import ProjectForm from '../components/project/ProjectForm';
import ProjectTable from '../components/project/ProjectTable';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import ProjectModals from '../components/project/ProjectModals';
import SearchToolbar from '../components/project/SearchToolbar';
import ExportWizardModal, {
  BulkProgress,
} from '../components/modals/ExportWizardModal';
import useProjectList from '../hooks/useProjectList';
import useProjectSelection from '../hooks/useProjectSelection';
import ImportWizardModal from '../components/modals/ImportWizardModal';
import type { ImportSummary } from '../../main/projects';
import { useAppStore } from '../store';

// Lists all available projects and lets the user open them.

const ProjectManagerView: React.FC = () => {
  const { projects, formats, sortKey, asc, refresh, handleSort } =
    useProjectList();
  const [search, setSearch] = useState('');
  const [filterVersion, setFilterVersion] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [progress, setProgress] = useState<BulkProgress | null>(null);
  const [importing, setImporting] = useState(false);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(
    null
  );

  const toast = useToast();

  const openProject = useAppStore((s) => s.openProject);
  const duplicateProject = useAppStore((s) => s.duplicateProject);
  const deleteProject = useAppStore((s) => s.deleteProject);
  const deleteProjects = useAppStore((s) => s.deleteProjects);
  const setToast = useAppStore((s) => s.setToast);

  const handleOpen = (n: string) => {
    openProject(n);
  };

  const handleImport = () => {
    setImporting(true);
    window.electronAPI
      ?.importProject()
      .then((s) => {
        if (s) setImportSummary(s);
        refresh();
      })
      .finally(() => setImporting(false));
  };

  const handleCreate = async (name: string, minecraftVersion: string) => {
    await window.electronAPI?.createProject(name, minecraftVersion);
    await refresh();
    toast({ message: 'Project created', type: 'success' });
  };

  let clearSelection: () => void = () => {};
  const handleDeleteSelected = (names: string[]) => {
    if (names.length > 1) {
      deleteProjects(names, () => {
        clearSelection();
        refresh();
      });
    } else if (names.length === 1) {
      deleteProject(names[0]);
      clearSelection();
    }
  };

  const { selected, toggleAll, toggleOne, clear } = useProjectSelection(
    handleOpen,
    handleDeleteSelected
  );
  clearSelection = clear;

  useEffect(() => {
    setToast(toast);
    return () => setToast(null);
  }, [toast, setToast]);

  const handleBulkExport = () => {
    if (selected.size === 0) return;
    setProgress({ current: 0, total: selected.size });
    window.electronAPI
      ?.exportProjects(Array.from(selected))
      .then(() => {
        toast({ message: 'Bulk export complete', type: 'success' });
        clearSelection();
      })
      .catch(() => toast({ message: 'Bulk export failed', type: 'error' }))
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

  return (
    <section className="flex flex-col gap-4 max-w-5xl mx-auto">
      <div className="flex-1">
        <div className="flex items-center mb-2 gap-2">
          <h2 className="font-display text-xl flex-1">Projects</h2>
          <ExternalLink
            href="https://minecraft.wiki/w/Tutorials/Creating_a_resource_pack"
            aria-label="Help"
            className="btn btn-circle btn-ghost btn-sm"
          >
            <QuestionMarkCircleIcon className="w-5 h-5" />
          </ExternalLink>
        </div>
        <ProjectForm
          formats={formats}
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
        <ProjectInfoPanel project={activeProject} />
        <ProjectTable
          projects={sortedProjects}
          sortKey={sortKey}
          asc={asc}
          onSort={handleSort}
          selected={selected}
          onSelect={toggleOne}
          onSelectAll={(c) =>
            toggleAll(
              sortedProjects.map((p) => p.name),
              c
            )
          }
          onRowClick={setActiveProject}
        />
        {(importing || importSummary) && (
          <ImportWizardModal
            inProgress={importing}
            summary={importSummary ?? undefined}
            onClose={() => setImportSummary(null)}
          />
        )}
        {progress && (
          <ExportWizardModal progress={progress} onClose={() => {}} />
        )}
        <ProjectModals refresh={refresh} toast={toast} />
      </div>
    </section>
  );
};
export default ProjectManagerView;
