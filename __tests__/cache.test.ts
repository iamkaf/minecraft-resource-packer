import { describe, it, expect, afterAll, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import archiver from 'archiver';
import { v4 as uuid } from 'uuid';

import { ensureAssets } from '../src/main/assets/cache';
import { VERSION_MANIFEST } from '../src/main/assets/network';

const manifestStub = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, 'fixtures', 'version_manifest.json'),
    'utf-8'
  )
);

describe('ensureAssets', () => {
  const version = `test-${uuid()}`;
  const cacheBase = path.join(os.tmpdir(), 'assets-cache', version);
  afterAll(() => fs.rmSync(cacheBase, { recursive: true, force: true }));

  it('downloads and extracts the client jar', async () => {
    const jarSrc = path.join(os.tmpdir(), `jar-${uuid()}.zip`);
    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(jarSrc);
      const archive = archiver('zip');
      output.on('close', resolve);
      archive.on('error', reject);
      archive.pipe(output);
      archive.append('data', {
        name: 'assets/minecraft/textures/block/stone.png',
      });
      archive.finalize();
    });
    const jarBuf = fs.readFileSync(jarSrc);

    const manifest = {
      ...manifestStub,
      versions: [{ id: version, url: 'http://host/version.json' }],
    };
    const verInfo = {
      downloads: { client: { url: 'http://host/client.jar' } },
    };

    const fetchMock = vi.fn(async (url: string) => {
      if (url === VERSION_MANIFEST) {
        return new Response(JSON.stringify(manifest));
      }
      if (url === manifest.versions[0].url) {
        return new Response(JSON.stringify(verInfo));
      }
      if (url === verInfo.downloads.client.url) {
        return new Response(jarBuf);
      }
      throw new Error(`Unexpected url ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    const root = await ensureAssets(version);
    const texPath = path.join(
      root,
      'assets',
      'minecraft',
      'textures',
      'block',
      'stone.png'
    );
    expect(fs.existsSync(texPath)).toBe(true);

    vi.unstubAllGlobals();
  });
});
