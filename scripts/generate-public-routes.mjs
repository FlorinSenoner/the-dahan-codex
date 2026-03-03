import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const rootDir = resolve(import.meta.dirname, '..')
const publicDir = resolve(rootDir, 'public')
const siteUrl = 'https://dahan-codex.com'

function toAspectSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function getConvexSiteUrl() {
  const explicit = process.env.VITE_CONVEX_SITE_URL?.trim()
  if (explicit) {
    return explicit.replace(/\/+$/, '')
  }

  const cloud = process.env.VITE_CONVEX_URL?.trim()
  if (!cloud) {
    throw new Error('Missing VITE_CONVEX_URL (or VITE_CONVEX_SITE_URL) for route generation')
  }

  return cloud.replace(/\.convex\.cloud\/?$/, '.convex.site')
}

async function fetchPublicSnapshot() {
  const endpoint = `${getConvexSiteUrl()}/public-snapshot?force=1&t=${Date.now()}`
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch public snapshot (${response.status})`)
  }

  return await response.json()
}

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
}

function normalizePublicRoute(route) {
  if (!route || route === '/') {
    return '/'
  }

  const withLeadingSlash = route.startsWith('/') ? route : `/${route}`
  const withoutTrailingSlashes = withLeadingSlash.replace(/\/+$/, '')
  return `${withoutTrailingSlashes}/`
}

export async function getPublicRoutes() {
  const snapshot = await fetchPublicSnapshot()

  const baseRoutes = ['/', '/credits/', '/settings/', '/spirits/']
  const baseSpirits = snapshot.spirits.filter((spirit) => !spirit.isAspect)

  const spiritRoutes = baseSpirits.map((spirit) => `/spirits/${spirit.slug}/`)

  const aspectRoutes = snapshot.spirits
    .filter((spirit) => spirit.isAspect && spirit.baseSpirit && spirit.aspectName)
    .map((aspect) => {
      const base = snapshot.spirits.find((candidate) => candidate._id === aspect.baseSpirit)
      if (!base) return null
      return `/spirits/${base.slug}/${toAspectSlug(aspect.aspectName)}/`
    })
    .filter(Boolean)

  return uniqueSorted([...baseRoutes, ...spiritRoutes, ...aspectRoutes]).map(normalizePublicRoute)
}

export async function writeSitemap(routes) {
  const resolvedRoutes = routes ?? (await getPublicRoutes())
  const sitemapLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ]

  for (const route of resolvedRoutes) {
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
