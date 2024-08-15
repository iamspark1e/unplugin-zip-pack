import { createUnplugin } from 'unplugin'
import type { Options, FilterFunction, MergedOptions } from './types'
import JSZip from 'jszip'
import { readdirSync, statSync, writeFileSync, readFileSync } from 'fs'
import { join, relative, sep } from 'path'

const defaultOptions = {
  in: "./dist",
  out: "dist.zip",
  enabled: true,
  sep: "/"
}

function getAllFiles(dirPath: string, filterFn?: FilterFunction): string[] {
  let files = readdirSync(dirPath);
  if (filterFn && typeof filterFn === 'function') files = files.filter(filterFn)
  const result = [];
  for (const file of files) {
    const filePath = join(dirPath, file);
    if (statSync(filePath).isDirectory()) {
      result.push(...getAllFiles(filePath, filterFn))
    } else {
      result.push(filePath);
    }
  }
  return result;
}

export const unplugin = createUnplugin((options: Options) => {
  return {
    name: 'unplugin-zip-pack',
    buildEnd: () => {
      let isCompress = false;
      process.on("beforeExit", async () => {
        if (isCompress) return;
        if (options.hooks && options.hooks.pre) {
          await options.hooks.pre();
        }
        const mergedOption: MergedOptions = {
          ...defaultOptions,
          ...options
        }
        if (!mergedOption.enabled) {
          console.log("[unplugin-zip-pack] skipped by user option.")
          return;
        }
        const zip = new JSZip();
        const files = getAllFiles(mergedOption.in, mergedOption.filter)
        if (files && Array.isArray(files) && files.length) {
          files.forEach((file: string) => {
            const fileData = readFileSync(file, { encoding: "binary" })
            zip.file(relative(mergedOption.in, file).replace(new RegExp(sep === "\\" ? "\\\\" : "/", "g"), mergedOption.sep), fileData, { binary: true })
          })
        }
        isCompress = true
        zip.generateAsync({ type: "arraybuffer" })
          .then(async (data) => {
            writeFileSync(mergedOption.out, Buffer.from(data))
            console.log(`[unplugin-zip-pack] Success: ${mergedOption.out} has been generated.`);
            if (options.hooks && options.hooks.post) {
              await options.hooks.post();
            }
          });
      })
    }
  }
})

export default unplugin