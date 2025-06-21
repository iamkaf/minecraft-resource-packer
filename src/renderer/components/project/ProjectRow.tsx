import React from 'react';
import { Checkbox } from '../daisy/input';
import { Button } from '../daisy/actions';
import {
  ArrowRightCircleIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import defaultPack from '../../../../resources/default_pack.png';
import ProjectContextMenu from './ProjectContextMenu';
import type { ProjectInfo } from './ProjectTable';
import { useAppStore } from '../../store';

interface Props {
  project: ProjectInfo;
  projects: ProjectInfo[];
  index: number;
  selected: Set<string>;
  onSelect: (name: string, checked: boolean) => void;
  lastIndexRef: React.MutableRefObject<number | null>;
  onRowClick: (name: string) => void;
}

export default function ProjectRow({
  project,
  projects,
  index,
  selected,
  onSelect,
  lastIndexRef,
  onRowClick,
}: Props) {
  const openProject = useAppStore((s) => s.openProject);
  const duplicateProject = useAppStore((s) => s.duplicateProject);
  const deleteProject = useAppStore((s) => s.deleteProject);
  const [menuPos, setMenuPos] = React.useState<{ x: number; y: number } | null>(
    null
  );
  const firstItem = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (menuPos && firstItem.current) firstItem.current.focus();
  }, [menuPos]);

  const closeMenu = () => setMenuPos(null);

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
    if (e.key === 'Enter' && selected.size <= 1) openProject(project.name);
    if (e.key === 'Delete' && selected.size <= 1) deleteProject(project.name);
    if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
      e.preventDefault();
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setMenuPos({ x: rect.right, y: rect.bottom });
    }
  };

  return (
    <tr
      onClick={() => onRowClick(project.name)}
      onDoubleClick={() => openProject(project.name)}
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
        <img src={defaultPack} alt="Pack icon" className="w-6 h-6" />
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
            openProject(project.name);
          }}
        >
          <ArrowRightCircleIcon className="w-4 h-4" />
          Open
        </Button>
        <Button
          className="btn-info btn-sm flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            duplicateProject(project.name);
          }}
        >
          <DocumentDuplicateIcon className="w-4 h-4" />
          Duplicate
        </Button>
        <Button
          className="btn-error btn-sm flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            deleteProject(project.name);
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
        />
      )}
    </tr>
  );
}
