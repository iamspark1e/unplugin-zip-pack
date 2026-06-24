import {
  index_default
} from "./chunk-3FWBPXD5.js";

// src/nuxt.ts
function nuxt_default(options = {}, nuxt) {
  nuxt.hook("webpack:config", async (config) => {
    const cfg = config;
    cfg.plugins = cfg.plugins || [];
    cfg.plugins.unshift(index_default.webpack(options));
  });
  nuxt.hook("vite:extendConfig", async (config) => {
    const cfg = config;
    cfg.plugins = cfg.plugins || [];
    cfg.plugins.push(index_default.vite(options));
  });
}
export {
  nuxt_default as default
};
