import { useState, useCallback } from 'react';
import useProjectHotkeys from './useProjectHotkeys';

export default function useProjectSelection(
  onOpen: (name: string) => void,
  onDelete: (names: string[]) => void
) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleAll = useCallback((names: string[], checked: boolean) => {
    setSelected(checked ? new Set(names) : new Set());
  }, []);

  const toggleOne = useCallback((name: string, checked: boolean) => {
    setSelected((prev) => {
      const ns = new Set(prev);
      if (checked) ns.add(name);
      else ns.delete(name);
      return ns;
    });
  }, []);

  const clear = useCallback(() => setSelected(new Set()), []);

  useProjectHotkeys(selected, onOpen, onDelete);

  return { selected, toggleAll, toggleOne, clear };
}
