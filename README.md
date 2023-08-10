<h1  align='center'>unplugin-zip-pack</h1>

<p align='center'>
  <!-- <a href="https://codecov.io/gh/iamspark1e/unplugin-zip-pack" ><img src=""/></a> -->
  <a href="https://www.npmjs.com/package/unplugin-zip-pack"><img src="https://img.shields.io/npm/v/unplugin-zip-pack" /></a>
  <a href="https://www.npmjs.com/package/unplugin-zip-pack"><img src="https://img.shields.io/npm/dm/unplugin-zip-pack" /></a>
</p>

<!--<p align='center'>English | <a href="./README.zh.md">中文文档</a></p>-->
<br />
<p align='center'><i>Zip your build files with JSZip, powered by <a href="https://github.com/unjs/unplugin" target="_blank">unplugin</a></i></p>
<p align='center'><i>使用JSZip打包构建成果，由<a href="https://github.com/unjs/unplugin" target="_blank">unplugin</a>驱动</i></p>
<br />

## Quick Start

```bash
npm i unplugin-zip-pack@latest -D # Or yarn/pnpm as you like
```

## Usage

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import ZipPack from 'unplugin-zip-pack/vite'

export default defineConfig({
  plugins: [
    ZipPack({ /* options */ }),
  ],
})
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import ZipPack from 'unplugin-zip-pack/rollup'

export default {
  plugins: [
    ZipPack({ /* options */ }),
  ],
}
```

<br></details>


<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-zip-pack/webpack')({ /* options */ })
  ]
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default {
  buildModules: [
    ['unplugin-zip-pack/nuxt', { /* options */ }],
  ],
}
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-zip-pack/webpack')({ /* options */ }),
    ],
  },
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import ZipPack from 'unplugin-zip-pack/esbuild'

build({
  plugins: [ZipPack()],
})
```

<br></details>

## Configuration

```typescript
export type Options = {
  /**
   * Input Dir
   * @default `./dist`
   */
  in?: string;
  /**
   * Output file name (with path)
   * @default `dist.zip`
   */
  out?: string;
  filter?: FilterFunction;
  /**
   * Switcher of enable plugin
   * @default true
   */
  enabled?: boolean;
}
```