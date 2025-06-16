import type { Rectangle } from 'electron';
import Store from 'electron-store';

const store = new Store<{
  windowBounds: Rectangle | undefined;
  maximized: boolean;
}>({
  defaults: { windowBounds: undefined, maximized: false },
});

export function getWindowBounds(): Rectangle | undefined {
  return store.get('windowBounds');
}

export function setWindowBounds(bounds: Rectangle): void {
  store.set('windowBounds', bounds);
}

export function isMaximized(): boolean {
  return store.get('maximized');
}

export function setMaximized(flag: boolean): void {
  store.set('maximized', flag);
}
