import { useCallback, useRef } from 'react';

export default function useThumbnailNavigation(
  files: string[],
  selected: Set<string>,
  setSelected: React.Dispatch<React.SetStateAction<Set<string>>>,
  cols = 6
) {
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const register = useCallback(
    (file: string) => (el: HTMLDivElement | null) => {
      if (el) refs.current[file] = el;
      else delete refs.current[file];
    },
    []
  );

  const focusFile = (file: string) => {
    const el = refs.current[file];
    if (el) {
      el.focus();
      if (typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ block: 'nearest' });
      }
    }
  };

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key))
        return;
      if (files.length === 0) return;
      e.preventDefault();
      const list = files;
      let idx = selected.size === 1 ? list.indexOf(Array.from(selected)[0]) : 0;
      if (idx < 0) idx = 0;
      switch (e.key) {
        case 'ArrowRight':
          idx = Math.min(list.length - 1, idx + 1);
          break;
        case 'ArrowLeft':
          idx = Math.max(0, idx - 1);
          break;
        case 'ArrowDown':
          idx = Math.min(list.length - 1, idx + cols);
          break;
        case 'ArrowUp':
          idx = Math.max(0, idx - cols);
          break;
      }
      const target = list[idx];
      setSelected(new Set([target]));
      focusFile(target);
    },
    [files, selected, setSelected, cols]
  );

  return { register, onKeyDown };
}
