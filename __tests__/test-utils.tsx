import React from 'react';
import { vi } from 'vitest';
import { useProject } from '../src/renderer/components/providers/ProjectProvider';

export function SetPath({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  const { setPath } = useProject();
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    setPath(path);
    setReady(true);
  }, [path]);
  return ready ? <>{children}</> : null;
}

const handlers: Record<string, ReturnType<typeof vi.fn>> = {};

export const electronAPI: Window['electronAPI'] = new Proxy(handlers, {
  get(target, prop: string) {
    if (!(prop in target)) {
      // create a mock function on first access
      target[prop as string] = vi.fn();
    }
    return target[prop as string];
  },
});

// expose mocks on the global window object
(window as unknown as { electronAPI: Window['electronAPI'] }).electronAPI =
  electronAPI;
