import path from 'path';
import sharp from 'sharp';
import { listTextures, getTexturePath } from './assets';

/** Pastel color palette for icon backgrounds. */
const pastel = ['#fbcfe8', '#bfdbfe', '#bbf7d0', '#fde68a', '#fcd5ce'];

/** Generate a random pack icon in `projectPath/pack.png`. */
export async function generatePackIcon(projectPath: string): Promise<void> {
  const textures = await listTextures(projectPath);
  const items = textures.filter(
    (t) => t.startsWith('item/') || t.startsWith('items/')
  );
  if (items.length === 0) return;
  const choice = items[Math.floor(Math.random() * items.length)];
  const itemPath = await getTexturePath(projectPath, choice);

  const bgColor = pastel[Math.floor(Math.random() * pastel.length)];
  const base = sharp({
    create: {
      width: 120,
      height: 120,
      channels: 4,
      background: bgColor,
    },
  }).png();
  const bordered = base.extend({
    top: 4,
    bottom: 4,
    left: 4,
    right: 4,
    background: '#000',
  });
  const itemBuf = await sharp(itemPath)
    .resize(64, 64, { fit: 'contain' })
    .png()
    .toBuffer();
  await bordered
    .composite([{ input: itemBuf, gravity: 'center' }])
    .toFile(path.join(projectPath, 'pack.png'));
}

/** Save a custom icon file to `projectPath/pack.png` with a coloured border. */
export async function savePackIcon(
  projectPath: string,
  file: string,
  border: string
): Promise<void> {
  const inner = await sharp(file)
    .resize(120, 120, { fit: 'contain' })
    .png()
    .toBuffer();
  await sharp({
    create: { width: 128, height: 128, channels: 4, background: border },
  })
    .composite([{ input: inner, top: 4, left: 4 }])
    .png()
    .toFile(path.join(projectPath, 'pack.png'));
}

export function registerIconHandlers(ipc: import('electron').IpcMain): void {
  ipc.handle(
    'save-pack-icon',
    (_e, project: string, file: string, border: string) =>
      savePackIcon(project, file, border)
  );
}
