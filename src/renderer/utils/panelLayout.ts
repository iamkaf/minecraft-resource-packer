import Store from 'electron-store';

interface LayoutStore {
  layouts: Record<string, number[]>;
}

let store: Pick<Store<LayoutStore>, 'get' | 'set'>;
if (process.env.NODE_ENV === 'test') {
  const mem: Record<string, unknown> = {};
  store = {
    get: (key: string) => mem[key],
    set: (key: string, value: unknown) => {
      mem[key] = value;
    },
  } as Store<LayoutStore>;
} else {
  store = new Store<LayoutStore>({ name: 'layout' });
}

export function loadLayout(id: string, defaults: number[]): number[] {
  const saved = store.get(`layouts.${id}`) as number[] | undefined;
  return Array.isArray(saved) && saved.length === defaults.length
    ? saved
    : defaults;
}

export function saveLayout(id: string, sizes: number[]): void {
  store.set(`layouts.${id}`, sizes);
}
