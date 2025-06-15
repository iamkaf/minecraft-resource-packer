import path from 'path';
import sharp from 'sharp';
import { listTextures, getTexturePath } from './assets';
import { z } from 'zod';
import type { IconOptions } from '../shared/icon';

/** Pastel color palette for icon backgrounds. */
const pastel = ['#fbcfe8', '#bfdbfe', '#bbf7d0', '#fde68a', '#fcd5ce'];

/** Generate a random pack icon in `projectPath/pack.png`. */
export async function generatePackIcon(
  projectPath: string,
  borderColor = '#000'
): Promise<void> {
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
    background: borderColor,
  });
  const itemBuf = await sharp(itemPath)
    .resize(64, 64, { fit: 'contain' })
    .png()
    .toBuffer();
  await bordered
    .composite([{ input: itemBuf, gravity: 'center' }])
    .toFile(path.join(projectPath, 'pack.png'));
}

/** Generate a custom pack icon. */
export async function buildIcon(
  projectPath: string,
  options: IconOptions
): Promise<void> {
  const opts = z
    .object({
      item: z.string().optional(),
      bgColor: z.string().optional(),
      borderColor: z.string().default('#000'),
      data: z.string().optional(),
    })
    .parse(options);

  let base: sharp.Sharp;
  if (opts.data) {
    const buf = Buffer.from(opts.data, 'base64');
    base = sharp(buf).resize(120, 120, { fit: 'contain' }).png();
  } else {
    const bg =
      opts.bgColor ?? pastel[Math.floor(Math.random() * pastel.length)];
    base = sharp({
      create: { width: 120, height: 120, channels: 4, background: bg },
    }).png();
    if (opts.item) {
      const itemPath = await getTexturePath(projectPath, opts.item);
      const itemBuf = await sharp(itemPath)
        .resize(64, 64, { fit: 'contain' })
        .png()
        .toBuffer();
      base = base.composite([{ input: itemBuf, gravity: 'center' }]);
    }
  }

  await base
    .extend({
      top: 4,
      bottom: 4,
      left: 4,
      right: 4,
      background: opts.borderColor ?? '#000',
    })
    .toFile(path.join(projectPath, 'pack.png'));
}
