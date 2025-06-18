import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '../daisy/actions';

interface Props {
  asset: string;
  firstItemRef?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
  onAdd: (name: string) => void;
  onReveal: (name: string) => void;
}

export default function AssetSelectorContextMenu({
  asset,
  firstItemRef,
  style,
  onAdd,
  onReveal,
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
          onClick={() => onAdd(asset)}
        >
          Add to Project
        </Button>
      </li>
      <li>
        <Button role="menuitem" onClick={() => onReveal(asset)}>
          Reveal
        </Button>
      </li>
    </ul>,
    root
  );
}
