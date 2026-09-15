import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { parseChangelog } from "./src/lib/release";
import { JINYU_API_BASE_URL, JINYU_PROXY_PREFIX } from "./src/constant/provider";
import { createMediaDownloadProxyPlugin } from "./server/media-download-proxy";
import { createMediaCachePlugin, resolveMediaCacheDirectory } from "./server/media-cache";

const webDir = dirname(fileURLToPath(import.meta.url));
const localVersion = readFileSync(resolve(webDir, "../VERSION"), "utf8").trim() || "dev";
const localChangelog = readFileSync(resolve(webDir, "../CHANGELOG.md"), "utf8");
const mediaCache = resolveMediaCacheDirectory(resolve(webDir, ".."));
const jinyuProxy = {
    target: JINYU_API_BASE_URL,
    changeOrigin: true,
    secure: true,
    rewrite: (path: string) => path.slice(JINYU_PROXY_PREFIX.length),
};

export default defineConfig({
    base: process.env.VITE_BASE || "/",
    plugins: [react(), createMediaDownloadProxyPlugin(), createMediaCachePlugin({ cacheDir: mediaCache.cacheDir, allowedDataRoot: mediaCache.dataRoot })],
    resolve: {
        alias: {
            "@": resolve(webDir, "src"),
        },
    },
    define: {
        __APP_VERSION__: JSON.stringify(localVersion),
        __APP_RELEASES__: JSON.stringify(parseChangelog(localChangelog)),
    },
    build: {
        rollupOptions: {
            input: {
                app: resolve(webDir, "index.html"),
                splashscreen: resolve(webDir, "splashscreen.html"),
            },
        },
    },
    // Route development requests and Blob uploads through Jinyu; keys stay in headers.
    server: {
        proxy: { [JINYU_PROXY_PREFIX]: jinyuProxy },
        strictPort: true,
        watch: {
            ignored: ["**/src-tauri/**"],
        },
    },
    preview: {
        proxy: { [JINYU_PROXY_PREFIX]: jinyuProxy },
    },
});
