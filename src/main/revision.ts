import fs from 'fs';
import path from 'path';

/** Save the current version of a file into the project's .history folder */
export async function saveRevision(
  project: string,
  rel: string
): Promise<void> {
  const abs = path.join(project, rel);
  if (!fs.existsSync(abs)) return;
  const histDir = path.join(project, '.history', rel);
  await fs.promises.mkdir(histDir, { recursive: true });
  const stamp = Date.now();
  const ext = path.extname(rel);
  const dest = path.join(histDir, `${stamp}${ext}`);
  await fs.promises.copyFile(abs, dest);
  const list = await fs.promises.readdir(histDir);
  if (list.length > 20) {
    const sorted = list.sort();
    const remove = sorted.slice(0, list.length - 20);
    await Promise.all(
      remove.map((f) => fs.promises.unlink(path.join(histDir, f)))
    );
  }
}

/** List revisions for the given file relative path */
export async function listRevisions(
  project: string,
  rel: string
): Promise<string[]> {
  const histDir = path.join(project, '.history', rel);
  try {
    const list = await fs.promises.readdir(histDir);
    return list.sort().reverse();
  } catch {
    return [];
  }
}

/** Restore the specified revision */
export async function restoreRevision(
  project: string,
  rel: string,
  revision: string
): Promise<void> {
  const histDir = path.join(project, '.history', rel);
  const src = path.join(histDir, revision);
  const dest = path.join(project, rel);
  if (!fs.existsSync(src)) throw new Error('Revision not found');
  await saveRevision(project, rel);
  await fs.promises.copyFile(src, dest);
}
