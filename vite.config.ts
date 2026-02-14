/// <reference types="vitest/config" />

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tsConfigPaths from 'vite-tsconfig-paths'

/** Stamps today's date into sitemap.xml `__BUILD_DATE__` placeholders after build. */
function sitemapDate(): Plugin {
  return {
    name: 'sitemap-date',
    closeBundle() {
      const file = resolve(__dirname, 'dist/sitemap.xml')
      const today = new Date().toISOString().slice(0, 10)
      writeFileSync(file, readFileSync(file, 'utf-8').replaceAll('__BUILD_DATE__', today))
    },
  }
}

export default defineConfig({
  test: {
    exclude: ['e2e/**', 'node_modules/**'],
    passWithNoTests: true,
  },
  base: '/',
  server: {
    port: 4127,
  },
  preview: {
    port: 4227,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        appShell: resolve(__dirname, 'app-shell.html'),
      },
    },
  },
  plugins: [
    sitemapDate(),
    // Must be before viteReact()
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: 'src/routes',
      generatedRouteTree: 'src/routeTree.gen.ts',
    }),
    tailwindcss(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    viteReact(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'prompt',
      injectRegister: false,
      devOptions: {
        enabled: true,
        type: 'module',
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
        globIgnores: ['cards/**'],
      },
      manifest: {
        name: 'The Dahan Codex',
        short_name: 'Dahan Codex',
        description: 'Spirit Island companion app - spirit library, openings, game tracker',
        start_url: '/',
        display: 'standalone',
        background_color: '#1f1510',
        theme_color: '#1f1510',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})
