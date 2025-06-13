// Global type declarations used by the renderer process.
export {};

import type { IpcRequestMap, IpcResponseMap, IpcEventMap } from './ipc/types';

type IpcInvoke<C extends keyof IpcRequestMap> = (
  ...args: IpcRequestMap[C]
) => Promise<IpcResponseMap[C]>;

type IpcListener<C extends keyof IpcEventMap> = (
  listener: (event: unknown, data: IpcEventMap[C]) => void
) => void;

declare global {
  interface Window {
    electronAPI?: {
      [K in keyof IpcRequestMap as K extends keyof IpcEventMap
        ? never
        : K]: IpcInvoke<K>;
    } & {
      [K in keyof IpcEventMap as K]: IpcListener<K>;
    };
  }
}
