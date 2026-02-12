import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const rootDir = resolve(import.meta.dirname, '..')
const dataDir = resolve(rootDir, 'scripts', 'data')
const publicDir = resolve(rootDir, 'public')
const siteUrl = 'https://dahan-codex.com'

function toSlugSegment(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf-8'))
}

function unique(array) {
  return [...new Set(array)]
}

export function getPublicRoutes() {
  const spirits = loadJson(resolve(dataDir, 'spirits.json'))
  const aspects = loadJson(resolve(dataDir, 'aspects.json'))

  const baseRoutes = ['/', '/spirits', '/credits']
  const spiritRoutes = spirits.map((spirit) => `/spirits/${spirit.slug}`)
  const aspectRoutes = aspects.map(
    (aspect) => `/spirits/${aspect.baseSpiritSlug}/${toSlugSegment(aspect.name)}`,
  )

  return unique([...baseRoutes, ...spiritRoutes, ...aspectRoutes]).sort((a, b) =>
    a.localeCompare(b),
  )
}

export function writeSitemap(routes = getPublicRoutes()) {
  const sitemapLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ]

  for (const route of routes) {
    sitemapLines.push(
      `  <url><loc>${siteUrl}${route}</loc><lastmod>__BUILD_DATE__</lastmod></url>`,
    )
  }

  sitemapLines.push('</urlset>')

  writeFileSync(resolve(publicDir, 'sitemap.xml'), `${sitemapLines.join('\n')}\n`, 'utf-8')
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  const routes = getPublicRoutes()
  writeSitemap(routes)
  console.log(`Generated ${routes.length} public routes and sitemap.xml`)
}
