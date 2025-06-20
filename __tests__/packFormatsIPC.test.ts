import { describe, it, expect } from 'vitest';
import { listPackFormats as listFormats } from '../src/main/assets';

describe('listFormats', () => {
  it('returns pack formats', async () => {
    const list = await listFormats();
    expect(list[0]).toHaveProperty('format');
    expect(list[0]).toHaveProperty('label');
  });
});
