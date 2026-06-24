import { Options } from './types.cjs';

interface NuxtInstance {
    hook: (name: string, fn: (...args: unknown[]) => void) => void;
}
declare function export_default(options: Options | undefined, nuxt: NuxtInstance): void;

export { export_default as default };
