import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/sw.ts', 'convex/**/*.ts', 'scripts/*.ts'],
  project: ['src/**/*.{ts,tsx}', 'convex/**/*.ts'],
  ignore: ['src/routeTree.gen.ts', 'convex/_generated/**', 'src/components/ui/**'],
  ignoreDependencies: ['tailwindcss'],
}

export default config
