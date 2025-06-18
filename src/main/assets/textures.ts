/**
 * Helpers for listing and manipulating texture files.
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

import { toPosixPath } from '../../shared/toPosixPath';
import { readProjectMeta, writeProjectMeta } from '../projectMeta';
import { ensureAssets } from './cache';
import { setCacheTexturesDir } from './protocols';

/** Recursively list all texture paths available for the given project version. */
export async function listTextures(projectPath: string): Promise<string[]> {
  const meta = await readProjectMeta(projectPath);
  const root = await ensureAssets(meta.minecraft_version);
  const texRoot = path.join(root, 'assets', 'minecraft', 'textures');
  const out: string[] = [];
  const walk = async (dir: string) => {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(p);
      } else if (entry.name.endsWith('.png')) {
        const rel = path.relative(texRoot, p);
        out.push(toPosixPath(rel));
      }
    }
  };
  await walk(texRoot);
  return out;
}

/** Copy a texture from the cache into the project directory. */
export async function addTexture(
  projectPath: string,
  texture: string
): Promise<void> {
  const meta = await readProjectMeta(projectPath);
  const root = await ensureAssets(meta.minecraft_version);
  const src = path.join(root, 'assets', 'minecraft', 'textures', texture);
  const dest = path.join(
    projectPath,
    'assets',
    'minecraft',
    'textures',
    texture
  );
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  await fs.promises.copyFile(src, dest);
  meta.assets.push(`assets/minecraft/textures/${texture}`);
  await writeProjectMeta(projectPath, meta);
}

/** Return the absolute path to a cached texture for the given project. */
export async function getTexturePath(
  projectPath: string,
  texture: string
): Promise<string> {
  const meta = await readProjectMeta(projectPath);
  const root = await ensureAssets(meta.minecraft_version);
  return path.join(root, 'assets', 'minecraft', 'textures', texture);
}

/** Convert a texture path into a URL using the `vanilla://` protocol. */
export async function getTextureURL(
  projectPath: string,
  texture: string
): Promise<string> {
  const meta = await readProjectMeta(projectPath);
  const cacheRoot = await ensureAssets(meta.minecraft_version);
  setCacheTexturesDir(path.join(cacheRoot, 'assets', 'minecraft', 'textures'));
  return `vanilla://${texture}`;
}

/** Combine multiple textures into a single PNG and return a data URL. */
export async function createTextureAtlas(
  projectPath: string,
  textures: string[]
): Promise<string> {
  const meta = await readProjectMeta(projectPath);
  const root = await ensureAssets(meta.minecraft_version);
  const texDir = path.join(root, 'assets', 'minecraft', 'textures');

  const composites: Array<{ input: Buffer; left: number; top: number }> = [];
  let width = 0;
  let height = 0;
  for (const tex of textures) {
    const img = sharp(path.join(texDir, tex));
    const info = await img.metadata();
    const buf = await img.png().toBuffer();
    composites.push({ input: buf, left: width, top: 0 });
    width += info.width ?? 0;
    height = Math.max(height, info.height ?? 0);
  }
  if (width === 0 || height === 0) return '';
  const out = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toBuffer();
  return `data:image/png;base64,${out.toString('base64')}`;
}
