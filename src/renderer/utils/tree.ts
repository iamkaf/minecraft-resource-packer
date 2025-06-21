export interface TreeItem {
  id: string;
  name: string;
  children?: TreeItem[];
}

// Internal structure used while building the tree. Children are stored in an
// object keyed by name for quick lookup during insertion.
interface NodeMap {
  id: string;
  name: string;
  children: Record<string, NodeMap>;
}

export function buildTree(paths: string[]): TreeItem[] {
  // Build a nested map of nodes where each segment of the path becomes a
  // property lookup. This makes it easy to insert new nodes while iterating
  // over all paths.
  const root: Record<string, NodeMap> = {};
  for (const p of paths) {
    const parts = p.split('/');
    let map = root;
    let cur = '';
    for (const part of parts) {
      // Build the full id for the node as we descend and create placeholder
      // entries if they don't exist.
      cur = cur ? `${cur}/${part}` : part;
      if (!map[part]) {
        map[part] = { id: cur, name: part, children: {} };
      }
      map = map[part].children;
    }
  }
  // Convert the intermediate NodeMap representation into the TreeItem shape
  // expected by callers, pruning empty children arrays.
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
