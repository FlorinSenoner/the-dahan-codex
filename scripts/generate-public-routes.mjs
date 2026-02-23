import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../convex/_generated/api.js'

const rootDir = resolve(import.meta.dirname, '..')
const publicDir = resolve(rootDir, 'public')
const siteUrl = 'https://dahan-codex.com'

function toSlugSegment(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

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

function unique(array) {
  return [...new Set(array)]
}

async function loadPublicSnapshotFromConvex() {
  const convexUrl = process.env.VITE_CONVEX_URL
  if (!convexUrl) {
    throw new Error('Missing VITE_CONVEX_URL')
  }
  validateConvexUrl(convexUrl)

  const client = new ConvexHttpClient(convexUrl)
  return await client.query(api.publicSnapshot.get, {})
}

export async function getPublicRoutes() {
  const snapshot = await loadPublicSnapshotFromConvex()
  const spirits = Array.isArray(snapshot.spirits) ? snapshot.spirits : []

  const baseRoutes = ['/', '/spirits', '/credits']
  const spiritRoutes = spirits
    .filter((spirit) => !spirit.isAspect)
    .map((spirit) => `/spirits/${spirit.slug}`)
  const aspectRoutes = spirits
    .filter((spirit) => spirit.isAspect && spirit.aspectName)
    .map((aspect) => `/spirits/${aspect.slug}/${toSlugSegment(String(aspect.aspectName))}`)

  return unique([...baseRoutes, ...spiritRoutes, ...aspectRoutes]).sort((a, b) =>
    a.localeCompare(b),
  )
}

export async function writeSitemap(routes) {
  const routeList = routes ?? (await getPublicRoutes())
  const sitemapLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ]

  for (const route of routeList) {
    sitemapLines.push(
      `  <url><loc>${siteUrl}${route}</loc><lastmod>__BUILD_DATE__</lastmod></url>`,
    )
  }

  sitemapLines.push('</urlset>')

  writeFileSync(resolve(publicDir, 'sitemap.xml'), `${sitemapLines.join('\n')}\n`, 'utf-8')
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  const routes = await getPublicRoutes()
  await writeSitemap(routes)
  console.log(`Generated ${routes.length} public routes and sitemap.xml`)
}
