import { describe, it, expect } from 'vitest';
import { generateProjectName } from '../src/renderer/utils/names';

describe('generateProjectName', () => {
  it('returns pronounceable name', () => {
    const name = generateProjectName();
    expect(name).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+$/);
  });
});
