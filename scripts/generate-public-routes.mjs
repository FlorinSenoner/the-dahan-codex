import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const rootDir = resolve(import.meta.dirname, '..')
const publicDir = resolve(rootDir, 'public')
const siteUrl = 'https://dahan-codex.com'
const appShellRoutes = ['/games', '/sign-in', '/sign-up']

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
  return withLeadingSlash.replace(/\/+$/, '')
}

export async function getPublicRoutes() {
  const snapshot = await fetchPublicSnapshot()

  const baseRoutes = ['/', '/credits', '/settings', '/spirits']
  const baseSpirits = snapshot.spirits.filter((spirit) => !spirit.isAspect)

  const spiritRoutes = baseSpirits.map((spirit) => `/spirits/${spirit.slug}`)

  const aspectRoutes = snapshot.spirits
    .filter((spirit) => spirit.isAspect && spirit.baseSpirit && spirit.aspectName)
    .map((aspect) => {
      const base = snapshot.spirits.find((candidate) => candidate._id === aspect.baseSpirit)
      if (!base) return null
      return `/spirits/${base.slug}/${toAspectSlug(aspect.aspectName)}`
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

export async function writeRedirects() {
  const redirectLines = [
    // Canonicalize trailing slash public routes to slashless URLs.
    '/credits/ /credits 301',
    '/settings/ /settings 301',
    '/spirits/ /spirits 301',
    '/spirits/*/ /spirits/:splat 301',

    // Keep spirit art requests as files and recover bad cached `*.webp/` URLs.
    '/spirits/*.webp/ /spirits/:splat.webp 301',
    '/spirits/*.webp /spirits/:splat.webp 200',

    // Public prerendered routes.
    '/credits /credits/index.html 200',
    '/settings /settings/index.html 200',
    '/spirits /spirits/index.html 200',
    '/spirits/* /spirits/:splat/index.html 200',
  ]

  // Client-only app routes served from app shell.
  for (const route of appShellRoutes) {
    redirectLines.push(`${route} /app-shell 200`)
    redirectLines.push(`${route}/* /app-shell 200`)
  }

  writeFileSync(resolve(publicDir, '_redirects'), `${redirectLines.join('\n')}\n`, 'utf-8')
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  const routes = await getPublicRoutes()
  await writeSitemap(routes)
  await writeRedirects()
  console.log(`Generated ${routes.length} public routes, sitemap.xml, and _redirects`)
}
