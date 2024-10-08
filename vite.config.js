// ==== This vite config is only being used by unit test !! ====
import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'
import UnpluginZipPack from "./src/index"
import path from "path";

export default defineConfig(() => {
    return {
        root: path.resolve(__dirname, 'test', 'example'),
        plugins: [react(), UnpluginZipPack.vite({
            in: "./dist",
            out: path.resolve(__dirname, 'test', 'example', 'test-result.zip'),
            sep: "\\"
        })],
        build: {
            outDir: "./dist",
            emptyOutDir: true
        },
    }
})