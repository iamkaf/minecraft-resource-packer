export interface TreeItem {
  id: string;
  name: string;
  children?: TreeItem[];
}

interface NodeMap {
  id: string;
  name: string;
  children: Record<string, NodeMap>;
}

export function buildTree(paths: string[]): TreeItem[] {
  const root: Record<string, NodeMap> = {};
  for (const p of paths) {
    const parts = p.split('/');
    let map = root;
    let cur = '';
    for (const part of parts) {
      cur = cur ? `${cur}/${part}` : part;
      if (!map[part]) {
        map[part] = { id: cur, name: part, children: {} };
      }
      map = map[part].children;
    }
  }
  const convert = (m: Record<string, NodeMap>): TreeItem[] =>
    Object.values(m).map((n) => {
      const children = convert(n.children);
      return {
        id: n.id,
        name: n.name,
        ...(children.length > 0 ? { children } : {}),
      };
    });
  return convert(root);
}
