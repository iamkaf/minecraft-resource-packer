import { describe, it, expect } from 'vitest';
import { IconOptionsSchema } from '../src/shared/icon';

describe('IconOptionsSchema', () => {
  it('parses values', () => {
    const parsed = IconOptionsSchema.parse({ borderColor: '#000' });
    expect(parsed.borderColor).toBe('#000');
  });
});
