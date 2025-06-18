import { describe, it, expect } from 'vitest';
import { listPackFormats } from '../src/main/assets';

describe('listPackFormats', () => {
  it('returns pack formats', async () => {
    const list = await listPackFormats();
    expect(list[0]).toHaveProperty('format');
    expect(list[0]).toHaveProperty('label');
  });
});
