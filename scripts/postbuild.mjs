import { promises as fs } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), '../dist')
const files = await fs.readdir(distDir)

for (const file of files.filter(file => file.endsWith('.cjs') && !file.startsWith('chunk-'))) {
  console.log(' POST ', `Fix ${file}`)
  const filePath = resolve(distDir, file)
  let code = await fs.readFile(filePath, 'utf8')
  code = code.replace('exports.default =', 'module.exports =')
  code += 'exports.default = module.exports;'
  await fs.writeFile(filePath, code)
}
