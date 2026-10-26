import { spawn } from 'node:child_process'
import { access, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const viteBin = resolve(projectRoot, process.env.VITE_BIN || 'node_modules/vite/bin/vite.js')
const pluginUrl = pathToFileURL(resolve(projectRoot, 'dist/vite.js')).href
const testRoot = await mkdtemp(join(tmpdir(), 'unplugin-zip-pack-vite-'))

try {
  await writeFile(join(testRoot, 'index.html'), '<h1>unplugin-zip-pack</h1>')
  await writeFile(join(testRoot, 'vite.config.mjs'), `
import zipPack from ${JSON.stringify(pluginUrl)}

export default {
  build: { outDir: 'dist' },
  plugins: [zipPack({ in: 'dist', out: 'dist.zip' })],
}
`)

  await new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, [viteBin, 'build'], {
      cwd: testRoot,
      stdio: 'inherit',
    })
    child.on('error', reject)
    child.on('exit', code => {
      if (code === 0) resolvePromise()
      else reject(new Error(`Vite build exited with code ${code}`))
    })
  })

  await access(join(testRoot, 'dist.zip'))
} finally {
  await rm(testRoot, { recursive: true, force: true })
}
