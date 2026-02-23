import { spawn } from 'node:child_process'
import { resolve } from 'node:path'

const rootDir = resolve(import.meta.dirname, '..')

function parseArgs(argv) {
  const args = {
    deployment: 'dev',
    budget: null,
    command: [],
  }

  let i = 0
  // `pnpm <script> -- ...` can pass a leading `--`.
  if (argv[i] === '--') {
    i += 1
  }

  while (i < argv.length) {
    const token = argv[i]
    if (token === '--') {
      args.command = argv.slice(i + 1)
      break
    }
    if (token === '--deployment') {
      args.deployment = argv[i + 1]
      i += 2
      continue
    }
    if (token === '--budget') {
      args.budget = Number(argv[i + 1])
      i += 2
      continue
    }
    throw new Error(`Unknown argument: ${token}`)
  }

  if (!args.command.length) {
    throw new Error(
      'Missing command. Example: node scripts/measure-convex-calls.mjs --deployment prod --budget 10 -- pnpm build:public',
    )
  }
  if (!['dev', 'prod'].includes(args.deployment)) {
    throw new Error('Invalid --deployment. Use "dev" or "prod".')
  }
  if (args.budget !== null && (!Number.isFinite(args.budget) || args.budget < 0)) {
    throw new Error('Invalid --budget. Expected a non-negative number.')
  }

  return args
}

function sleep(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms))
}

function onExit(processRef) {
  return new Promise((resolvePromise, rejectPromise) => {
    processRef.on('error', rejectPromise)
    processRef.on('exit', (code, signal) => {
      resolvePromise({ code: code ?? 1, signal })
    })
  })
}

function readFunctionIdentifier(event) {
  return (
    event.identifier ??
    event.udfPath ??
    event.functionName ??
    event.name ??
    event.function ??
    '(unknown)'
  )
}

async function terminateProcess(processRef, exitPromise) {
  if (processRef.exitCode === null && processRef.signalCode === null) {
    processRef.kill('SIGTERM')
    await sleep(800)
  }
  if (processRef.exitCode === null && processRef.signalCode === null) {
    processRef.kill('SIGKILL')
  }
  return await exitPromise
}

async function main() {
  const { deployment, budget, command } = parseArgs(process.argv.slice(2))
  const logArgs = ['convex', 'logs', '--success', '--jsonl']
  if (deployment === 'prod') {
    logArgs.push('--prod')
  }

  const logProc = spawn('npx', logArgs, {
    cwd: rootDir,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false,
  })
  const logExitPromise = onExit(logProc)

  let logsStdout = ''
  let logsStderr = ''

  logProc.stdout.on('data', (chunk) => {
    logsStdout += chunk.toString()
  })
  logProc.stderr.on('data', (chunk) => {
    logsStderr += chunk.toString()
  })

  await sleep(1200)
  const startTs = Date.now() / 1000

  const commandString = command.join(' ')
  const commandProc = spawn(commandString, {
    cwd: rootDir,
    env: process.env,
    stdio: 'inherit',
    shell: true,
  })
  const cmdResult = await onExit(commandProc)
  const endTs = Date.now() / 1000

  await sleep(1200)
  await terminateProcess(logProc, logExitPromise)

  const events = []
  for (const rawLine of logsStdout.split('\n')) {
    const line = rawLine.trim()
    if (!line.startsWith('{')) continue

    try {
      const parsed = JSON.parse(line)
      if (typeof parsed.timestamp !== 'number') continue
      if (parsed.timestamp < startTs || parsed.timestamp > endTs + 4) continue
      events.push(parsed)
    } catch {
      // Ignore malformed JSONL lines.
    }
  }

  const byFunction = new Map()
  for (const event of events) {
    const identifier = readFunctionIdentifier(event)
    byFunction.set(identifier, (byFunction.get(identifier) ?? 0) + 1)
  }
  const sortedFunctions = [...byFunction.entries()].sort((a, b) => b[1] - a[1])

  console.log('\nConvex call measurement')
  console.log(`Deployment: ${deployment}`)
  console.log(
    `Window: ${new Date(startTs * 1000).toISOString()} -> ${new Date(endTs * 1000).toISOString()}`,
  )
  console.log(`Total completions: ${events.length}`)

  if (sortedFunctions.length > 0) {
    console.log('Per-function counts:')
    for (const [name, count] of sortedFunctions) {
      console.log(`- ${name}: ${count}`)
    }
  } else {
    console.log('Per-function counts: none observed in measurement window')
  }

  if (logsStderr.trim()) {
    console.log('\nConvex log stream stderr:')
    console.log(logsStderr.trim())
  }

  if (budget !== null) {
    if (events.length > budget) {
      console.error(`\nBudget check: FAIL (${events.length} > ${budget})`)
      process.exit(1)
    }
    console.log(`Budget check: PASS (${events.length} <= ${budget})`)
  }

  if (cmdResult.code !== 0) {
    process.exit(cmdResult.code)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
