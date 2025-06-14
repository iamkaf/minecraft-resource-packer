import { useCallback, MouseEvent } from 'react';
import { shell } from 'electron';

/**
 * Returns a click handler that opens the given URL using Electron's shell.
 */
export function useExternalLink(url: string) {
  return useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      shell.openExternal(url);
    },
    [url]
  );
}
