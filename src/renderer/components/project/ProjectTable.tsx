import React from 'react';
import ProjectTableHeader from './ProjectTableHeader';
import ProjectRow from './ProjectRow';

export interface ProjectInfo {
  name: string;
  version: string;
  assets: number;
  lastOpened: number;
}

export default function ProjectTable({
  projects,
  sortKey,
  asc,
  onSort,
  selected,
  onSelect,
  onSelectAll,
  onRowClick,
}: {
  projects: ProjectInfo[];
  onSort: (k: keyof ProjectInfo) => void;
  selected: Set<string>;
  onSelect: (name: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onRowClick: (name: string) => void;
  sortKey: keyof ProjectInfo;
  asc: boolean;
}) {
  const lastIndex = React.useRef<number | null>(null);
  const allSelected =
    selected.size > 0 && projects.every((p) => selected.has(p.name));

  return (
    <div className="flex-1 overflow-x-auto" tabIndex={0}>
      <table className="table table-zebra w-full">
        <ProjectTableHeader
          allSelected={allSelected}
          onSelectAll={onSelectAll}
          sortKey={sortKey}
          asc={asc}
          onSort={onSort}
        />
        <tbody>
          {projects.map((p, i) => (
            <ProjectRow
              key={p.name}
              project={p}
              projects={projects}
              index={i}
              selected={selected}
              onSelect={onSelect}
              lastIndexRef={lastIndex}
              onRowClick={onRowClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
