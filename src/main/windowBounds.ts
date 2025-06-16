import type { Rectangle } from 'electron';
import Store from 'electron-store';

const store = new Store<{
  windowBounds: Rectangle | undefined;
  fullscreen: boolean;
}>({
  defaults: { windowBounds: undefined, fullscreen: false },
});

export function getWindowBounds(): Rectangle | undefined {
  return store.get('windowBounds');
}

export function setWindowBounds(bounds: Rectangle): void {
  store.set('windowBounds', bounds);
}

export function isFullscreen(): boolean {
  return store.get('fullscreen');
}

export function setFullscreen(flag: boolean): void {
  store.set('fullscreen', flag);
}
