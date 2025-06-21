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

/** Cache of texture lists keyed by project path and Minecraft version. */
const textureCache = new Map<string, string[]>();

/** Remove cached entries for the given project path. */
export function clearTextureCache(projectPath: string) {
  for (const key of textureCache.keys()) {
    if (key.startsWith(`${projectPath}:`)) textureCache.delete(key);
  }
}

/**
 * Recursively enumerate all vanilla textures available for a project.
 *
 * The project metadata indicates which Minecraft version the project targets.
 * We locate the cached assets for that version and walk the
 * `assets/minecraft/textures` directory. Every PNG file is added to the result
 * array using POSIX path separators.
 *
 * Results are memoised per project/version combination so repeated calls avoid
 * hitting the filesystem again.
 */
export async function listTextures(projectPath: string): Promise<string[]> {
  const meta = await readProjectMeta(projectPath);
  const key = `${projectPath}:${meta.minecraft_version}`;
  const cached = textureCache.get(key);
  if (cached) return cached;

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
  textureCache.set(key, out);
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

/**
 * Combine a set of textures into a single horizontally-aligned image.
 *
 * Each texture is loaded from the vanilla cache, converted to PNG and placed
 * next to the previous one. The function keeps track of the widest and tallest
 * dimensions seen to determine the final atlas size. The composed image is
 * returned as a base64 encoded PNG data URL so it can be used directly in the
 * renderer.
 */
export async function createTextureAtlas(
  projectPath: string,
  textures: string[]
): Promise<string> {
  const meta = await readProjectMeta(projectPath);
  const root = await ensureAssets(meta.minecraft_version);
  const texDir = path.join(root, 'assets', 'minecraft', 'textures');

  // Prepare a list of images to composite together. Each texture is appended
  // horizontally so we track the running width while keeping a constant top
  // offset. The height of the atlas is the tallest texture seen.
  const composites: Array<{ input: Buffer; left: number; top: number }> = [];
  let width = 0;
  let height = 0;
  for (const tex of textures) {
    const img = sharp(path.join(texDir, tex));
    const info = await img.metadata();
    const buf = await img.png().toBuffer();
    // Place the texture at the current x offset and advance the offset by the
    // texture's width.
    composites.push({ input: buf, left: width, top: 0 });
    width += info.width ?? 0;
    height = Math.max(height, info.height ?? 0);
  }
  if (width === 0 || height === 0) return '';
  // Create a transparent image large enough to hold all textures and composite
  // them in. The result is encoded as a PNG and returned as a base64 data URL.
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
