/**
 * Network utilities used to retrieve remote resources.
 */
/* c8 ignore start */
import fs from 'fs';
import path from 'path';

/** URL pointing to Mojang's version manifest which lists all official releases. */
export const VERSION_MANIFEST =
  'https://launchermeta.mojang.com/mc/game/version_manifest.json';

/** Fetch a JSON document from the given URL. */
export async function fetchJson<T>(url: string): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    return res.json() as Promise<T>;
  } catch (err) {
    if (url === VERSION_MANIFEST) {
      const local = path.join(__dirname, '../../shared/version_manifest.json');
      const data = await fs.promises.readFile(local, 'utf-8');
      return JSON.parse(data) as T;
    }
    throw err;
  }
}

/** Download a file from the given URL and save it to disk. */
export async function downloadFile(url: string, dest: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}`);
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  const array = new Uint8Array(await res.arrayBuffer());
  await fs.promises.writeFile(dest, array);
}
/* c8 ignore end */
