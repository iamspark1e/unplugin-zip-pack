import {
  src_default
} from "./chunk-4SR6TTJN.js";

// src/nuxt.ts
function nuxt_default(options = {}, nuxt) {
  nuxt.hook("webpack:config", async (config) => {
    config.plugins = config.plugins || [];
    config.plugins.unshift(src_default.webpack(options));
  });
  nuxt.hook("vite:extendConfig", async (config) => {
    config.plugins = config.plugins || [];
    config.plugins.push(src_default.vite(options));
  });
}
export {
  nuxt_default as default
};
