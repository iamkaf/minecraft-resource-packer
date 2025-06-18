import { describe, it, expect, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import http from 'http';
import { AddressInfo } from 'net';
import { v4 as uuid } from 'uuid';

import { fetchJson, downloadFile } from '../src/main/assets/network';

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
