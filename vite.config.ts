// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// On Netlify, NITRO_PRESET=netlify (set in netlify.toml) switches the build target.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    // Client-rendered app with a prerendered shell, used as the offline fallback.
    spa: { enabled: true },
  },
  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: null,
        devOptions: { enabled: false },
        filename: "sw.js",
        manifestFilename: "manifest.webmanifest",
        includeAssets: ["icons/*.png", "icons/*.svg"],
        manifest: {
          name: "Yard",
          short_name: "Yard",
          description: "Rent and tenant management for backyard-room landlords.",
          lang: "en-ZA",
          display: "standalone",
          start_url: "/home",
          scope: "/",
          background_color: "#FAFAF7",
          theme_color: "#FAFAF7",
          icons: [
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
            {
              src: "/icons/icon-maskable-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,woff2,webmanifest}"],
          navigateFallback: "/_shell.html",
          navigateFallbackDenylist: [/^\/~oauth/, /^\/api\//, /^\/_serverFn\//],
          cleanupOutdatedCaches: true,
          // No runtime caching: Supabase and auth requests always go to the network.
          runtimeCaching: [],
        },
      }),
    ],
  },
});
