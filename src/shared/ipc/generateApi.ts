import type { IpcRequestMap, IpcResponseMap, IpcEventMap } from './types';

type CamelCase<S extends string> = S extends `${infer P}-${infer R}`
  ? `${P}${Capitalize<CamelCase<R>>}`
  : S;

export type IpcApi = {
  [C in keyof IpcRequestMap as CamelCase<C & string>]: (
    ...args: IpcRequestMap[C]
  ) => Promise<IpcResponseMap[C]>;
} & {
  [E in keyof IpcEventMap as `on${Capitalize<CamelCase<E & string>>}`]: (
    listener: (event: unknown, data: IpcEventMap[E]) => void
  ) => () => void;
};
