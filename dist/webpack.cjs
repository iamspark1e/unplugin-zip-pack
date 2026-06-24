"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/webpack.ts
var webpack_exports = {};
__export(webpack_exports, {
  default: () => webpack_default
});
module.exports = __toCommonJS(webpack_exports);

// src/index.ts
var import_unplugin = require("unplugin");
var import_jszip = __toESM(require("jszip"), 1);
var import_fs = require("fs");
var import_path = require("path");
var defaultOptions = {
  in: "./dist",
  out: "dist.zip",
  enabled: true,
  sep: "/"
};
function getAllFiles(dirPath, filterFn) {
  let files = (0, import_fs.readdirSync)(dirPath);
  if (filterFn && typeof filterFn === "function") files = files.filter(filterFn);
  const result = [];
  for (const file of files) {
    const filePath = (0, import_path.join)(dirPath, file);
    if ((0, import_fs.statSync)(filePath).isDirectory()) {
      result.push(...getAllFiles(filePath, filterFn));
    } else {
      result.push(filePath);
    }
  }
  return result;
}
var unplugin = (0, import_unplugin.createUnplugin)((options) => {
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
        const zip = new import_jszip.default();
        const files = getAllFiles(mergedOption.in, mergedOption.filter);
        if (files && Array.isArray(files) && files.length) {
          files.forEach((file) => {
            const fileData = (0, import_fs.readFileSync)(file, { encoding: "binary" });
            zip.file((0, import_path.relative)(mergedOption.in, file).replace(new RegExp(import_path.sep === "\\" ? "\\\\" : "/", "g"), mergedOption.sep), fileData, { binary: true });
          });
        }
        isCompress = true;
        zip.generateAsync({ type: "arraybuffer" }).then(async (data) => {
          (0, import_fs.writeFileSync)(mergedOption.out, new Uint8Array(data));
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

// src/webpack.ts
var webpack_default = index_default.webpack;
exports.default = module.exports;