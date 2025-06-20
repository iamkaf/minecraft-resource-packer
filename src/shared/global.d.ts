/* c8 ignore start */
// Global type declarations used by the renderer process.
export {};

import type { IpcApi } from './ipc/generateApi';

declare global {
  interface Window {
    electronAPI?: IpcApi;
  }
}
/* c8 ignore end */
