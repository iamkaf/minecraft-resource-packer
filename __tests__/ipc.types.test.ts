import { describe, it, expectTypeOf } from 'vitest';
import type {
  IpcRequestMap,
  IpcResponseMap,
  IpcEventMap,
} from '../src/shared/ipc/types';
import type { IpcApi } from '../src/shared/ipc/generateApi';
import type { ProjectInfo } from '../src/main/projects';
import type { PackMeta } from '../src/shared/project';
import type { TextureEditOptions } from '../src/shared/texture';

describe('IPC type mappings', () => {
  it('edit-texture request and response', () => {
    expectTypeOf<IpcRequestMap['edit-texture']>().toEqualTypeOf<
      [string, TextureEditOptions]
    >();
    expectTypeOf<IpcResponseMap['edit-texture']>().toEqualTypeOf<void>();
  });

  it('load-pack-meta request and response', () => {
    expectTypeOf<IpcRequestMap['load-pack-meta']>().toEqualTypeOf<[string]>();
    expectTypeOf<IpcResponseMap['load-pack-meta']>().toEqualTypeOf<PackMeta>();
  });

  it('list-projects maps to ProjectInfo array', () => {
    expectTypeOf<IpcRequestMap['list-projects']>().toEqualTypeOf<[]>();
    expectTypeOf<IpcResponseMap['list-projects']>().toEqualTypeOf<
      ProjectInfo[]
    >();
  });

  it('IpcApi maps requests and events', () => {
    expectTypeOf<IpcApi['editTexture']>().toEqualTypeOf<
      (file: string, opts: TextureEditOptions) => Promise<void>
    >();
    expectTypeOf<IpcApi['onFileAdded']>().toEqualTypeOf<
      (
        listener: (event: unknown, data: IpcEventMap['file-added']) => void
      ) => () => void
    >();
  });
});
