/**
 * @file tests/vite-compat.test.ts
 *
 * 目的：验证 unplugin-zip-pack 在各 major 版本 Vite 下是否能正常工作。
 * 原理：为指定版本的 Vite 创建隔离测试目录，安装插件并执行 vite build。
 */

import { describe, it, expect, afterAll } from 'vitest'
import { execa } from 'execa'
import { join } from 'node:path'
import { existsSync, rmSync, mkdirSync, writeFileSync } from 'node:fs'

// === 可手动维护的最低兼容版本基线 ===
// 当 Vite 发布新 major 版本时，只需在此数组中新增一行即可。
const VITE_BASELINES = ['4.0.0', '5.0.0', '6.0.0']

// 测试临时目录根路径
const TEST_ROOT = join(__dirname, '.tmp')

// --- 工具函数 ---
async function runViteTest(version: string) {
    const cwd = join(TEST_ROOT, `vite-${version}`)

    // 清理旧目录
    if (existsSync(cwd)) rmSync(cwd, { recursive: true, force: true })
    mkdirSync(cwd, { recursive: true })

    // 初始化测试项目
    await execa('npm', ['init', '-y'], { cwd, stdout: 'ignore' })

    // 安装 vite + 当前插件（使用 file 引用）
    console.log(`\n🧩 Installing vite@${version} ...`)
    await execa('npm', ['install', `vite@${version}`, 'unplugin-zip-pack@file:../../..'], {
        cwd,
        stdio: 'inherit',
    })

    // 写入 vite.config.mjs
    writeFileSync(
        join(cwd, 'vite.config.mjs'),
        `
    import zipPack from 'unplugin-zip-pack/vite'
    export default {
      build: {
        outDir: 'dist',
        emptyOutDir: true
      },
      plugins: [
        zipPack({
          out: 'dist-zip.zip',
        })
      ]
    }
    `
    )

    // 写入最小化项目内容
    writeFileSync(join(cwd, 'index.html'), '<h1>Hello unplugin-zip-pack</h1>')
    writeFileSync(join(cwd, 'main.js'), 'console.log("zip-pack test");')

    // 执行构建
    console.log(`\n🚀 Running vite@${version} build ...`)
    const viteBin = join(cwd, 'node_modules', 'vite', 'bin', 'vite.js')
    const result = await execa('node', [viteBin, 'build'], { cwd, stdio: 'inherit' })

    // 验证构建结果
    expect(result.exitCode).toBe(0)
    expect(existsSync(join(cwd, 'dist-zip.zip'))).toBe(true)

    console.log(`✅ Vite ${version} passed compatibility test.`)
}

// --- 测试定义 ---
describe('Vite major version compatibility', () => {
    for (const version of VITE_BASELINES) {
        it(`should build successfully with vite@${version}`, async () => {
            await runViteTest(version)
        }, 120000) // 每个测试最多允许 2 分钟
    }

    // 测试完成后自动清理临时目录
    afterAll(() => {
        if (existsSync(TEST_ROOT)) {
            console.log('\n🧹 Cleaning up test temp directories...')
            rmSync(TEST_ROOT, { recursive: true, force: true })
        }
    })
})
