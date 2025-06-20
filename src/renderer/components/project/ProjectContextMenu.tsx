import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '../daisy/actions';
import { useAppStore } from '../../store';

interface Props {
  project: string;
  style?: React.CSSProperties;
  firstItemRef?: React.Ref<HTMLButtonElement>;
}

export default function ProjectContextMenu({
  project,
  style,
  firstItemRef,
}: Props) {
  const openProject = useAppStore((s) => s.openProject);
  const duplicateProject = useAppStore((s) => s.duplicateProject);
  const deleteProject = useAppStore((s) => s.deleteProject);
  const openProjectFolder = useAppStore((s) => s.openProjectFolder);
  const root = document.getElementById('overlay-root');
  if (!root) return null;
  const fallbackRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!firstItemRef || typeof firstItemRef === 'function') {
      fallbackRef.current?.focus();
    } else {
      firstItemRef.current?.focus();
    }
  }, []);
  return ReactDOM.createPortal(
    <ul
      className="menu dropdown-content bg-base-200 rounded-box fixed z-50 w-40 p-1 shadow"
      style={style}
      role="menu"
    >
      <li>
        <Button
          ref={
            (firstItemRef && typeof firstItemRef !== 'function'
              ? firstItemRef
              : fallbackRef) as React.Ref<HTMLButtonElement>
          }
          role="menuitem"
          onClick={() => openProject(project)}
        >
          Open
        </Button>
      </li>
      <li>
        <Button role="menuitem" onClick={() => openProjectFolder(project)}>
          Open Folder
        </Button>
      </li>
      <li>
        <Button role="menuitem" onClick={() => duplicateProject(project)}>
          Duplicate
        </Button>
      </li>
      <li>
        <Button role="menuitem" onClick={() => deleteProject(project)}>
          Delete
        </Button>
      </li>
    </ul>,
    root
  );
}
