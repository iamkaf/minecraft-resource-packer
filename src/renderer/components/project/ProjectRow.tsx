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
import ProjectContextMenu from './ProjectContextMenu';
import type { ProjectInfo } from './ProjectTable';

interface Props {
  project: ProjectInfo;
  projects: ProjectInfo[];
  index: number;
  selected: Set<string>;
  onSelect: (name: string, checked: boolean) => void;
  lastIndexRef: React.MutableRefObject<number | null>;
  onOpen: (name: string) => void;
  onDuplicate: (name: string) => void;
  onDelete: (name: string) => void;
  onRowClick: (name: string) => void;
}

export default function ProjectRow({
  project,
  projects,
  index,
  selected,
  onSelect,
  lastIndexRef,
  onOpen,
  onDuplicate,
  onDelete,
  onRowClick,
}: Props) {
  const [menuPos, setMenuPos] = React.useState<{ x: number; y: number } | null>(
    null
  );
  const firstItem = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (menuPos && firstItem.current) firstItem.current.focus();
  }, [menuPos]);

  const closeMenu = () => setMenuPos(null);

  const handleOpen = () => {
    onOpen(project.name);
    closeMenu();
  };
  const handleDuplicate = () => {
    onDuplicate(project.name);
    closeMenu();
  };
  const handleDelete = () => {
    onDelete(project.name);
    closeMenu();
  };

  const handleCheckbox = (
    e: React.ChangeEvent<HTMLInputElement> & {
      nativeEvent: MouseEvent;
    }
  ) => {
    e.stopPropagation();
    const checked = e.target.checked;
    if (e.nativeEvent.shiftKey && lastIndexRef.current !== null) {
      const start = Math.min(lastIndexRef.current, index);
      const end = Math.max(lastIndexRef.current, index);
      for (let i = start; i <= end; i++) {
        onSelect(projects[i].name, checked);
      }
    } else {
      onSelect(project.name, checked);
    }
    lastIndexRef.current = index;
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selected.size <= 1) onOpen(project.name);
    if (e.key === 'Delete' && selected.size <= 1) onDelete(project.name);
    if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
      e.preventDefault();
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setMenuPos({ x: rect.right, y: rect.bottom });
    }
  };

  return (
    <tr
      onClick={() => onRowClick(project.name)}
      onDoubleClick={() => onOpen(project.name)}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={`cursor-pointer ${selected.has(project.name) ? 'bg-base-300' : ''}`}
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
      <td>
        <Checkbox
          aria-label={`Select ${project.name}`}
          checked={selected.has(project.name)}
          onClick={(e) => e.stopPropagation()}
          onChange={handleCheckbox}
          className="checkbox checkbox-primary checkbox-sm"
        />
      </td>
      <td className="flex items-center gap-2">
        <img
          src={defaultPack as unknown as string}
          alt="Pack icon"
          className="w-6 h-6"
        />
        {project.name}
      </td>
      <td>{project.version}</td>
      <td>{project.assets}</td>
      <td>{new Date(project.lastOpened).toLocaleDateString()}</td>
      <td className="flex gap-1">
        <Button
          className="btn-accent btn-sm flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(project.name);
          }}
        >
          <ArrowRightCircleIcon className="w-4 h-4" />
          Open
        </Button>
        <Button
          className="btn-info btn-sm flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(project.name);
          }}
        >
          <DocumentDuplicateIcon className="w-4 h-4" />
          Duplicate
        </Button>
        <Button
          className="btn-error btn-sm flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project.name);
          }}
        >
          <TrashIcon className="w-4 h-4" />
          Delete
        </Button>
      </td>
      {menuPos && (
        <ProjectContextMenu
          project={project.name}
          style={{
            left: menuPos.x,
            top: menuPos.y,
            display: menuPos ? 'block' : 'none',
          }}
          firstItemRef={firstItem}
          onOpen={handleOpen}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      )}
    </tr>
  );
}
