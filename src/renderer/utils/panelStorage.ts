import type { PanelGroupStorage } from 'react-resizable-panels';
import Store from 'electron-store';

const store = new Store<{ [key: string]: string }>({
  name: 'layout',
  projectName: 'mc-pack-tool',
});

const storage: PanelGroupStorage = {
  getItem: (key: string) => {
    const val = store.get(key);
    return typeof val === 'string' ? (val as string) : null;
  },
  setItem: (key: string, value: string) => {
    store.set(key, value);
  },
};

export default storage;
