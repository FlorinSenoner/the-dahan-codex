import { createServer } from 'node:http'
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'
import { chromium } from '@playwright/test'
import { getPublicRoutes } from './generate-public-routes.mjs'

const rootDir = resolve(import.meta.dirname, '..')
const distDir = resolve(rootDir, 'dist')
const port = Number(process.env.PRERENDER_PORT || 4174)
const host = '127.0.0.1'

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
}

function safeJoin(base, targetPath) {
  const target = normalize(join(base, targetPath))
  if (!target.startsWith(base)) return null
  return target
}

function resolveStaticFilePath(requestPath) {
  const relativePath = requestPath === '/' ? '/index.html' : requestPath
  const candidate = safeJoin(distDir, relativePath)

  if (!candidate || !existsSync(candidate)) {
    return null
  }

  const candidateStat = statSync(candidate)
  if (candidateStat.isFile()) {
    return candidate
  }

  if (candidateStat.isDirectory()) {
    const indexCandidate = join(candidate, 'index.html')
    if (existsSync(indexCandidate) && statSync(indexCandidate).isFile()) {
      return indexCandidate
    }
  }

  return null
}

function startServer() {
  const indexPath = resolve(distDir, 'index.html')

  const server = createServer((req, res) => {
    const requestPath = req.url ? decodeURIComponent(req.url.split('?')[0]) : '/'
    const filePath = resolveStaticFilePath(requestPath)

    if (filePath) {
      const ext = extname(filePath).toLowerCase()
      const mimeType = mimeTypes[ext] || 'application/octet-stream'
      res.writeHead(200, { 'content-type': mimeType })
      res.end(readFileSync(filePath))
      return
    }

    // SPA fallback for client routes.
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    res.end(readFileSync(indexPath))
  })

  return new Promise((resolveServer) => {
    server.listen(port, host, () => resolveServer(server))
  })
}

function writePrerenderedHtml(route, html) {
  const output =
    html.startsWith('<!doctype html>') || html.startsWith('<!DOCTYPE html>')
      ? html
      : `<!doctype html>\n${html}`

  if (route === '/') {
    writeFileSync(resolve(distDir, 'index.html'), output, 'utf-8')
    return
  }

  const routeDir = resolve(distDir, route.replace(/^\//, ''))
  mkdirSync(routeDir, { recursive: true })
  writeFileSync(resolve(routeDir, 'index.html'), output, 'utf-8')
}

const routes = getPublicRoutes()

if (!Array.isArray(routes) || routes.length === 0) {
  throw new Error('No public routes found. Check public/public-snapshot.json and route generation.')
}

const server = await startServer()
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext()
const page = await context.newPage()

try {
  for (const route of routes) {
    const url = `http://${host}:${port}${route}`
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
    await page.waitForTimeout(500)
    const html = await page.content()
    writePrerenderedHtml(route, html)
    console.log(`Prerendered ${route}`)
  }
} finally {
  await browser.close()
  await new Promise((resolveServerClose) => server.close(resolveServerClose))
}
