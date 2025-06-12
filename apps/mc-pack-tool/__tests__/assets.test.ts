import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import http from 'http';
import { AddressInfo } from 'net';
import archiver from 'archiver';
import { v4 as uuid } from 'uuid';

import {
  fetchJson,
  downloadFile,
  ensureAssets,
  listTextures,
  listVersions,
} from '../src/main/assets';
import { createProject } from '../src/main/projects';
const manifestStub = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, 'fixtures', 'version_manifest.json'),
    'utf-8'
  )
);

describe('fetchJson', () => {
  it('parses JSON from an HTTP response', async () => {
    const server = http.createServer((_, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ foo: 'bar' }));
    });
    await new Promise((resolve) => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;

    const data = await fetchJson(`http://localhost:${port}`);
    expect(data).toEqual({ foo: 'bar' });

    server.close();
  });
});

describe('downloadFile', () => {
  const tmpDir = path.join(os.tmpdir(), `dl-${uuid()}`);
  afterAll(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

  it('saves the response body to disk', async () => {
    const server = http.createServer((_, res) => {
      res.end('hello');
    });
    await new Promise((resolve) => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;

    const dest = path.join(tmpDir, 'file.txt');
    await downloadFile(`http://localhost:${port}`, dest);

    expect(fs.readFileSync(dest, 'utf-8')).toBe('hello');
    server.close();
  });
});

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
      if (
        url === 'https://launchermeta.mojang.com/mc/game/version_manifest.json'
      ) {
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

describe('listTextures', () => {
  const baseDir = path.join(os.tmpdir(), `lt-${uuid()}`);
  const version = `lt-${uuid()}`;
  const projDir = path.join(baseDir, 'Pack');

  beforeAll(() => {
    createProject(baseDir, 'Pack', version);
    const texDir = path.join(
      os.tmpdir(),
      'assets-cache',
      version,
      'client',
      'assets',
      'minecraft',
      'textures',
      'block'
    );
    fs.mkdirSync(texDir, { recursive: true });
    fs.writeFileSync(path.join(texDir, 'foo.png'), 'data');
  });

  afterAll(() => fs.rmSync(baseDir, { recursive: true, force: true }));

  it('lists cached textures', async () => {
    const list = await listTextures(projDir);
    expect(list).toContain('block/foo.png');
  });
});

describe('listVersions', () => {
  it('returns ids from manifest', async () => {
    const fetchMock = vi.fn(
      async () => new Response(JSON.stringify(manifestStub))
    );
    vi.stubGlobal('fetch', fetchMock);
    const list = await listVersions();
    expect(list).toContain(manifestStub.versions[0].id);
    vi.unstubAllGlobals();
  });
});
