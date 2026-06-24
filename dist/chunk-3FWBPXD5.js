var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// src/index.ts
import { createUnplugin } from "unplugin";
import JSZip from "jszip";
import { readdirSync, statSync, writeFileSync, readFileSync } from "fs";
import { join, relative, sep } from "path";
var defaultOptions = {
  in: "./dist",
  out: "dist.zip",
  enabled: true,
  sep: "/"
};
function getAllFiles(dirPath, filterFn) {
  let files = readdirSync(dirPath);
  if (filterFn && typeof filterFn === "function") files = files.filter(filterFn);
  const result = [];
  for (const file of files) {
    const filePath = join(dirPath, file);
    if (statSync(filePath).isDirectory()) {
      result.push(...getAllFiles(filePath, filterFn));
    } else {
      result.push(filePath);
    }
  }
  return result;
}
var unplugin = createUnplugin((options) => {
  return {
    name: "unplugin-zip-pack",
    buildEnd: () => {
      let isCompress = false;
      process.on("beforeExit", async () => {
        if (isCompress) return;
        if (options.hooks && options.hooks.pre) {
          await options.hooks.pre();
        }
        const mergedOption = __spreadValues(__spreadValues({}, defaultOptions), options);
        if (!mergedOption.enabled) {
          console.log("[unplugin-zip-pack] skipped by user option.");
          return;
        }
        const zip = new JSZip();
        const files = getAllFiles(mergedOption.in, mergedOption.filter);
        if (files && Array.isArray(files) && files.length) {
          files.forEach((file) => {
            const fileData = readFileSync(file, { encoding: "binary" });
            zip.file(relative(mergedOption.in, file).replace(new RegExp(sep === "\\" ? "\\\\" : "/", "g"), mergedOption.sep), fileData, { binary: true });
          });
        }
        isCompress = true;
        zip.generateAsync({ type: "arraybuffer" }).then(async (data) => {
          writeFileSync(mergedOption.out, new Uint8Array(data));
          console.log(`[unplugin-zip-pack] Success: ${mergedOption.out} has been generated.`);
          if (options.hooks && options.hooks.post) {
            await options.hooks.post();
          }
        });
      });
    }
  };
});
var index_default = unplugin;

export {
  unplugin,
  index_default
};
