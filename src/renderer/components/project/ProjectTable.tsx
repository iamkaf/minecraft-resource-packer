import React from 'react';
import { Checkbox } from '../daisy/input';
import { Button } from '../daisy/actions';
import {
  ArrowRightCircleIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - webpack replaces import with URL string
import defaultPack from '../../../../resources/default_pack.png';

export interface ProjectInfo {
  name: string;
  version: string;
  assets: number;
  lastOpened: number;
}

export default function ProjectTable({
  projects,
  onSort,
  selected,
  onSelect,
  onSelectAll,
  onOpen,
  onDuplicate,
  onDelete,
  onRowClick,
}: {
  projects: ProjectInfo[];
  onSort: (k: keyof ProjectInfo) => void;
  selected: Set<string>;
  onSelect: (name: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onOpen: (name: string) => void;
  onDuplicate: (name: string) => void;
  onDelete: (name: string) => void;
  onRowClick: (name: string) => void;
}) {
  const lastIndex = React.useRef<number | null>(null);
  const allSelected =
    selected.size > 0 && projects.every((p) => selected.has(p.name));

  return (
    <div className="flex-1 overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>
              <Checkbox
                aria-label="Select all"
                checked={allSelected}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="checkbox checkbox-primary checkbox-sm"
              />
            </th>
            <th onClick={() => onSort('name')} className="cursor-pointer">
              Name
            </th>
            <th onClick={() => onSort('version')} className="cursor-pointer">
              MC Version
            </th>
            <th onClick={() => onSort('assets')} className="cursor-pointer">
              Assets
            </th>
            <th onClick={() => onSort('lastOpened')} className="cursor-pointer">
              Last opened
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr
              key={p.name}
              onClick={() => onRowClick(p.name)}
              onDoubleClick={() => onOpen(p.name)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onOpen(p.name);
                if (e.key === 'Delete') onDelete(p.name);
              }}
              tabIndex={0}
              className={`cursor-pointer ${
                selected.has(p.name) ? 'bg-base-300' : ''
              }`}
            >
              <td>
                <Checkbox
                  aria-label={`Select ${p.name}`}
                  checked={selected.has(p.name)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    const idx = projects.findIndex((x) => x.name === p.name);
                    const checked = e.target.checked;
                    if (
                      (e.nativeEvent as MouseEvent).shiftKey &&
                      lastIndex.current !== null
                    ) {
                      const start = Math.min(lastIndex.current, idx);
                      const end = Math.max(lastIndex.current, idx);
                      for (let i = start; i <= end; i++) {
                        onSelect(projects[i].name, checked);
                      }
                    } else {
                      onSelect(p.name, checked);
                    }
                    lastIndex.current = idx;
                  }}
                  className="checkbox checkbox-primary checkbox-sm"
                />
              </td>
              <td className="flex items-center gap-2">
                <img
                  src={defaultPack as unknown as string}
                  alt="Pack icon"
                  className="w-6 h-6"
                />
                {p.name}
              </td>
              <td>{p.version}</td>
              <td>{p.assets}</td>
              <td>{new Date(p.lastOpened).toLocaleDateString()}</td>
              <td className="flex gap-1">
                <Button
                  className="btn-accent btn-sm flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen(p.name);
                  }}
                >
                  <ArrowRightCircleIcon className="w-4 h-4" />
                  Open
                </Button>
                <Button
                  className="btn-info btn-sm flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(p.name);
                  }}
                >
                  <DocumentDuplicateIcon className="w-4 h-4" />
                  Duplicate
                </Button>
                <Button
                  className="btn-error btn-sm flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(p.name);
                  }}
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
