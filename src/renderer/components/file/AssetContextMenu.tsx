import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '../daisy/actions';
import { Checkbox } from '../daisy/input';

interface Props {
  filePath: string;
  selectionCount: number;
  noExportChecked: boolean;
  firstItemRef?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
  onReveal: (file: string) => void;
  onOpen: (file: string) => void;
  onRename: (file: string) => void;
  onMove: (file: string) => void;
  onDelete: (file: string) => void;
  onToggleNoExport: (checked: boolean) => void;
}

export default function AssetContextMenu({
  filePath,
  selectionCount,
  noExportChecked,
  firstItemRef,
  style,
  onReveal,
  onOpen,
  onRename,
  onMove,
  onDelete,
  onToggleNoExport,
}: Props) {
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
          onClick={() => onReveal(filePath)}
        >
          Reveal
        </Button>
      </li>
      <li>
        <Button role="menuitem" onClick={() => onOpen(filePath)}>
          Open
        </Button>
      </li>
      <li>
        <Button
          role="menuitem"
          onClick={() => onRename(filePath)}
          disabled={selectionCount > 1}
        >
          Rename
        </Button>
      </li>
      <li>
        <Button
          role="menuitem"
          onClick={() => onMove(filePath)}
          disabled={selectionCount > 1}
        >
          Move…
        </Button>
      </li>
      <li>
        <label className="flex gap-2 items-center cursor-pointer px-2">
          <span>No Export</span>
          <Checkbox
            type="checkbox"
            className="toggle-sm"
            checked={noExportChecked}
            onChange={(e) => onToggleNoExport(e.target.checked)}
          />
        </label>
      </li>
      <li>
        <Button role="menuitem" onClick={() => onDelete(filePath)}>
          {selectionCount > 1 ? 'Delete Selected' : 'Delete'}
        </Button>
      </li>
    </ul>,
    root
  );
}
