import React from 'react';
import { Checkbox } from '../daisy/input';
import { Button } from '../daisy/actions';
import {
  ArrowRightCircleIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - webpack replaces import with URL string
import defaultPack from '../../../../resources/default_pack.png';
import ProjectContextMenu from './ProjectContextMenu';

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
  sortKey: keyof ProjectInfo;
  asc: boolean;
}) {
  const lastIndex = React.useRef<number | null>(null);
  const allSelected =
    selected.size > 0 && projects.every((p) => selected.has(p.name));
  const [menuInfo, setMenuInfo] = React.useState<{
    name: string;
    x: number;
    y: number;
  } | null>(null);
  const firstItem = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (menuInfo && firstItem.current) firstItem.current.focus();
  }, [menuInfo]);

  const closeMenu = () => setMenuInfo(null);

  const handleOpen = (n: string) => {
    onOpen(n);
    closeMenu();
  };

  const handleDuplicate = (n: string) => {
    onDuplicate(n);
    closeMenu();
  };

  const handleDelete = (n: string) => {
    onDelete(n);
    closeMenu();
  };

  return (
    <div
      className="flex-1 overflow-x-auto"
      tabIndex={0}
      onBlur={(e) => {
        const overlay = document.getElementById('overlay-root');
        const next = e.relatedTarget as Node | null;
        if (
          !e.currentTarget.contains(next) &&
          !(overlay && overlay.contains(next))
        )
          closeMenu();
      }}
    >
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
              {sortKey === 'name' &&
                (asc ? (
                  <ChevronUpIcon className="w-3 h-3 inline-block ml-1" />
                ) : (
                  <ChevronDownIcon className="w-3 h-3 inline-block ml-1" />
                ))}
            </th>
            <th onClick={() => onSort('version')} className="cursor-pointer">
              MC Version
              {sortKey === 'version' &&
                (asc ? (
                  <ChevronUpIcon className="w-3 h-3 inline-block ml-1" />
                ) : (
                  <ChevronDownIcon className="w-3 h-3 inline-block ml-1" />
                ))}
            </th>
            <th onClick={() => onSort('assets')} className="cursor-pointer">
              Assets
              {sortKey === 'assets' &&
                (asc ? (
                  <ChevronUpIcon className="w-3 h-3 inline-block ml-1" />
                ) : (
                  <ChevronDownIcon className="w-3 h-3 inline-block ml-1" />
                ))}
            </th>
            <th onClick={() => onSort('lastOpened')} className="cursor-pointer">
              Last opened
              {sortKey === 'lastOpened' &&
                (asc ? (
                  <ChevronUpIcon className="w-3 h-3 inline-block ml-1" />
                ) : (
                  <ChevronDownIcon className="w-3 h-3 inline-block ml-1" />
                ))}
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
              onContextMenu={(e) => {
                e.preventDefault();
                setMenuInfo({ name: p.name, x: e.clientX, y: e.clientY });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && selected.size <= 1) onOpen(p.name);
                if (e.key === 'Delete' && selected.size <= 1) onDelete(p.name);
                if (
                  e.key === 'ContextMenu' ||
                  (e.shiftKey && e.key === 'F10')
                ) {
                  e.preventDefault();
                  const rect = (
                    e.currentTarget as HTMLElement
                  ).getBoundingClientRect();
                  setMenuInfo({ name: p.name, x: rect.right, y: rect.bottom });
                }
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
      {menuInfo && (
        <ProjectContextMenu
          project={menuInfo.name}
          style={{
            left: menuInfo.x,
            top: menuInfo.y,
            display: menuInfo ? 'block' : 'none',
          }}
          firstItemRef={firstItem}
          onOpen={handleOpen}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
