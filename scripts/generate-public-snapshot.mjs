import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const rootDir = resolve(import.meta.dirname, '..')
const outputPath = resolve(rootDir, 'public', 'public-snapshot.json')

function extractDeploymentName(urlString) {
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
  return match[1]
}

function parseJsonObjectFromOutput(output) {
  const start = output.indexOf('{')
  const end = output.lastIndexOf('}')
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`Could not parse JSON object from convex run output:\n${output}`)
  }
  return JSON.parse(output.slice(start, end + 1))
}

function generateSnapshot() {
  const convexUrl = process.env.VITE_CONVEX_URL
  if (!convexUrl) {
    throw new Error('Missing VITE_CONVEX_URL')
  }

  const deploymentName = extractDeploymentName(convexUrl)
  const runArgs = [
    'convex',
    'run',
    '--deployment-name',
    deploymentName,
    '--typecheck',
    'disable',
    '--codegen',
    'disable',
  ]
  if (process.env.CONVEX_PUSH_SNAPSHOT === '1') {
    runArgs.push('--push')
  }
  runArgs.push('publicSnapshot:get', '{}')

  const output = execFileSync(
    'npx',
    runArgs,
    {
      cwd: rootDir,
      encoding: 'utf8',
      env: process.env,
    },
  )

  const snapshot = parseJsonObjectFromOutput(output)
  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')

  const spiritCount = Array.isArray(snapshot.spirits) ? snapshot.spirits.length : 0
  console.log(`Generated public snapshot at ${outputPath} (${spiritCount} spirits)`)
}

generateSnapshot()
