import React from 'react';

interface Props {
  filePath: string;
  selectionCount: number;
  noExportChecked: boolean;
  firstItemRef?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
  onReveal: (file: string) => void;
  onOpen: (file: string) => void;
  onRename: (file: string) => void;
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
  onDelete,
  onToggleNoExport,
}: Props) {
  return (
    <ul
      className="menu dropdown-content bg-base-200 rounded-box fixed z-10 w-40 p-1 shadow"
      style={style}
      role="menu"
    >
      <li>
        <button
          ref={firstItemRef}
          role="menuitem"
          onClick={() => onReveal(filePath)}
        >
          Reveal
        </button>
      </li>
      <li>
        <button role="menuitem" onClick={() => onOpen(filePath)}>
          Open
        </button>
      </li>
      <li>
        <button
          role="menuitem"
          onClick={() => onRename(filePath)}
          disabled={selectionCount > 1}
        >
          Rename
        </button>
      </li>
      <li>
        <label className="flex gap-2 items-center cursor-pointer px-2">
          <span>No Export</span>
          <input
            type="checkbox"
            className="toggle toggle-sm"
            checked={noExportChecked}
            onChange={(e) => onToggleNoExport(e.target.checked)}
          />
        </label>
      </li>
      <li>
        <button role="menuitem" onClick={() => onDelete(filePath)}>
          {selectionCount > 1 ? 'Delete Selected' : 'Delete'}
        </button>
      </li>
    </ul>
  );
}
