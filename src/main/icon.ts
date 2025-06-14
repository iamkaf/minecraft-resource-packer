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
