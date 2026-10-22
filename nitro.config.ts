import { defineConfig } from 'nitro';

/**
 * Nitro is the deployment layer.
 *
 * The application itself is a front-end only Vite build — there is no server
 * logic in the product. Nitro exists so that the same build can be deployed
 * to any of the platforms Nitro supports, without the app knowing or caring
 * which one it landed on.
 *
 * Preset selection, in order of precedence:
 *   1. NITRO_PRESET in the environment
 *   2. cloudflare_module (Workers) — the default for this project
 *
 * Examples:
 *   NITRO_PRESET=cloudflare-pages bun run build
 *   NITRO_PRESET=netlify bun run build
 *   NITRO_PRESET=vercel bun run build
 *   NITRO_PRESET=node-server bun run build
 *   NITRO_PRESET=static bun run build
 */
export default defineConfig({
  preset: process.env.NITRO_PRESET || 'cloudflare_module',

  serverDir: 'server',

  // The Vite build is the public directory. Nitro copies it into the output
  // and serves it through the platform's asset pipeline.
  publicAssets: [
    {
      dir: 'dist',
      baseURL: '/',
      fallthrough: true,
    },
  ],

  routeRules: {
    // Vite emits content-hashed file names, so these are safe to cache hard.
    '/assets/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/fonts/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/brand/**': { headers: { 'cache-control': 'public, max-age=604800' } },
    '/*': { headers: { 'cache-control': 'public, max-age=0, must-revalidate' } },
  },

  compatibilityDate: '2026-10-01',
});
