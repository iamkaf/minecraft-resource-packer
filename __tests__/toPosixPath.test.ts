import { describe, it, expect } from 'vitest';
import { toPosixPath } from '../src/shared/toPosixPath';

describe('toPosixPath', () => {
  it('converts Windows style paths', () => {
    expect(toPosixPath('foo\\bar\\baz')).toBe('foo/bar/baz');
  });

  it('leaves POSIX paths unchanged', () => {
    expect(toPosixPath('foo/bar/baz')).toBe('foo/bar/baz');
  });
});
