import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '../daisy/actions';

interface Props {
  project: string;
  style?: React.CSSProperties;
  firstItemRef?: React.Ref<HTMLButtonElement>;
  onOpen: (name: string) => void;
  onDuplicate: (name: string) => void;
  onDelete: (name: string) => void;
}

export default function ProjectContextMenu({
  project,
  style,
  firstItemRef,
  onOpen,
  onDuplicate,
  onDelete,
}: Props) {
  const root = document.getElementById('overlay-root');
  if (!root) return null;
  return ReactDOM.createPortal(
    <ul
      className="menu dropdown-content bg-base-200 rounded-box fixed z-50 w-40 p-1 shadow"
      style={style}
      role="menu"
    >
      <li>
        <Button
          ref={firstItemRef}
          role="menuitem"
          onClick={() => onOpen(project)}
        >
          Open
        </Button>
      </li>
      <li>
        <Button role="menuitem" onClick={() => onDuplicate(project)}>
          Duplicate
        </Button>
      </li>
      <li>
        <Button role="menuitem" onClick={() => onDelete(project)}>
          Delete
        </Button>
      </li>
    </ul>,
    root
  );
}
