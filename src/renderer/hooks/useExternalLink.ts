import { useCallback, MouseEvent } from 'react';
import { shell } from 'electron';
import { useToast } from '../components/ToastProvider';

/**
 * Returns a click handler that opens the given URL using Electron's shell.
 */
export function useExternalLink(url: string) {
  const toast = useToast();
  return useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      shell
        .openExternal(url)
        .catch(() => toast({ message: 'Failed to open link', type: 'error' }));
    },
    [url, toast]
  );
}
