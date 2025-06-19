import React from 'react';
import { vi } from 'vitest';
import { useAppStore } from '../src/renderer/store';

export function SetPath({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  const setProjectPath = useAppStore((s) => s.setProjectPath);
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    setProjectPath(path);
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
