import type { Options } from './types'
import unplugin from '.'

interface NuxtInstance {
  hook: (name: string, fn: (...args: unknown[]) => void) => void
}

interface WebpackConfig {
  plugins?: unknown[]
}

interface ViteConfig {
  plugins?: unknown[]
}

export default function (options: Options = {}, nuxt: NuxtInstance) {
  // install webpack plugin
  nuxt.hook('webpack:config', async (config: unknown) => {
    const cfg = config as WebpackConfig
    cfg.plugins = cfg.plugins || []
    cfg.plugins.unshift(unplugin.webpack(options))
  })

  // install vite plugin
  nuxt.hook('vite:extendConfig', async (config: unknown) => {
    const cfg = config as ViteConfig
    cfg.plugins = cfg.plugins || []
    cfg.plugins.push(unplugin.vite(options))
  })
}
