// Preload script that safely exposes a small API surface to the renderer.
// The renderer cannot access Node.js directly, so we bridge the required
// functionality via IPC.
import { contextBridge, ipcRenderer } from 'electron';
import type {
  IpcRequestMap,
  IpcResponseMap,
  IpcEventMap,
} from '../shared/ipc/types';
import type { IpcApi } from '../shared/ipc/generateApi';

function invoke<C extends keyof IpcRequestMap>(
  channel: C,
  ...args: IpcRequestMap[C]
) {
  return ipcRenderer.invoke(channel, ...args) as Promise<IpcResponseMap[C]>;
}

function on<C extends keyof IpcEventMap>(
  channel: C,
  listener: (event: unknown, data: IpcEventMap[C]) => void
) {
  const handler = (_e: unknown, d: IpcEventMap[C]) => listener(_e, d);
  ipcRenderer.on(channel, handler);
  return () => ipcRenderer.removeListener(channel, handler);
}

function camelToKebab(name: string) {
  return name.replace(/([A-Z])/g, '-$1').toLowerCase();
}

const api: IpcApi = new Proxy({} as IpcApi, {
  get(_target, prop: string) {
    if (prop.startsWith('on')) {
      const event = prop.slice(2);
      const ch = camelToKebab(event.charAt(0).toLowerCase() + event.slice(1));
      return (listener: (e: unknown, d: unknown) => void) =>
        on(ch as keyof IpcEventMap, listener as any);
    }
    const channel = camelToKebab(prop);
    return (...args: unknown[]) =>
      invoke(channel as keyof IpcRequestMap, ...(args as any));
  },
}) as IpcApi;

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('electronAPI', api);
} else {
  // In development we disable context isolation so just attach directly.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).electronAPI = api;
}
