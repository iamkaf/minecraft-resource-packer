import { useEffect } from 'react';
import { useToast } from '../components/providers/ToastProvider';

export default function useProjectHotkeys(
  selected: Set<string>,
  onOpen: (name: string) => void,
  onDelete: (names: string[]) => void
) {
  const toast = useToast();
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (selected.size === 0) return;
      if (e.key === 'Delete') {
        e.preventDefault();
        onDelete(Array.from(selected));
        toast({
          message:
            selected.size > 1
              ? `Deleted ${selected.size} projects`
              : 'Project deleted',
          type: 'info',
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        Array.from(selected).forEach(onOpen);
        if (selected.size > 1) {
          toast({
            message: `Opened ${selected.size} projects`,
            type: 'success',
          });
        }
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [selected, onOpen, onDelete, toast]);
}
