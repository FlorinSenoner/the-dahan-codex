import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../convex/_generated/api.js'

const rootDir = resolve(import.meta.dirname, '..')
const outputPath = resolve(rootDir, 'public', 'public-snapshot.json')

function validateConvexUrl(urlString) {
  let parsed
  try {
    parsed = new URL(urlString)
  } catch {
    throw new Error(`Invalid VITE_CONVEX_URL: "${urlString}"`)
  }

  const host = parsed.hostname
  const match = host.match(/^([a-z0-9-]+)\.convex\.cloud$/)
  if (!match) {
    throw new Error(
      `VITE_CONVEX_URL must match https://<deployment>.convex.cloud. Received "${urlString}"`,
    )
  }
}

async function generateSnapshot() {
  const convexUrl = process.env.VITE_CONVEX_URL
  if (!convexUrl) {
    throw new Error('Missing VITE_CONVEX_URL')
  }
  validateConvexUrl(convexUrl)

  const client = new ConvexHttpClient(convexUrl)
  const snapshot = await client.query(api.publicSnapshot.get, {})
  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')

  const spiritCount = Array.isArray(snapshot.spirits) ? snapshot.spirits.length : 0
  console.log(`Generated public snapshot at ${outputPath} (${spiritCount} spirits)`)
}

generateSnapshot().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
