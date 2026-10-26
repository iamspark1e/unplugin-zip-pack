import { describe, expect, it } from 'vitest'
import esbuild from '../src/esbuild'
import nuxt from '../src/nuxt'
import rollup from '../src/rollup'
import vite from '../src/vite'
import webpack from '../src/webpack'

describe('adapter exports', () => {
  it('creates plugins for the supported build tools', () => {
    expect(esbuild({})).toMatchObject({ name: 'unplugin-zip-pack', setup: expect.any(Function) })
    expect(rollup({})).toMatchObject({ name: 'unplugin-zip-pack' })
    expect(vite({})).toMatchObject({ name: 'unplugin-zip-pack' })
    expect(webpack({})).toMatchObject({ apply: expect.any(Function) })
  })

  it('registers both Nuxt build tool adapters', () => {
    const hooks: string[] = []
    nuxt({}, {
      hook(name) {
        hooks.push(name)
      },
    })

    expect(hooks).toEqual(['webpack:config', 'vite:extendConfig'])
  })
})
