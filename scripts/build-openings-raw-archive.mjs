import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, 'data')
const OUTPUT_FILE = 'openings-raw-by-source.json'

const RAW_SOURCES = [
  {
    id: 'wiki-openings',
    file: 'wiki-openings.json',
    sourceType: 'wiki',
    sourceName: 'Spirit Island Wiki',
    collection: 'Phantaskippy guides',
  },
  {
    id: 'wiki-antistone-openings',
    file: 'wiki-antistone-openings.json',
    sourceType: 'wiki',
    sourceName: 'Spirit Island Wiki',
    collection: 'AntiStone guides',
  },
  {
    id: 'bgg-openings',
    file: 'bgg-openings.json',
    sourceType: 'bgg',
    sourceName: 'BoardGameGeek',
    collection: 'Openings master thread',
  },
  {
    id: 'bgg-je-openings-1',
    file: 'bgg-je-openings-1.json',
    sourceType: 'bgg',
    sourceName: 'BoardGameGeek',
    collection: 'Jagged Earth openings thread 1',
  },
  {
    id: 'bgg-je-openings-2',
    file: 'bgg-je-openings-2.json',
    sourceType: 'bgg',
    sourceName: 'BoardGameGeek',
    collection: 'Jagged Earth openings thread 2',
  },
  {
    id: 'bgg-promo-openings',
    file: 'bgg-promo-openings.json',
    sourceType: 'bgg',
    sourceName: 'BoardGameGeek',
    collection: 'Promo/Feather & Flame openings thread',
  },
  {
    id: 'bgg-vengeance-opening',
    file: 'bgg-vengeance-opening.json',
    sourceType: 'bgg',
    sourceName: 'BoardGameGeek',
    collection: 'Vengeance dedicated opening thread',
  },
  {
    id: 'horizons-openings',
    file: 'horizons-openings.json',
    sourceType: 'bgg',
    sourceName: 'BoardGameGeek',
    collection: 'Horizons openings thread',
  },
  {
    id: 'nature-incarnate-openings',
    file: 'nature-incarnate-openings.json',
    sourceType: 'bgg',
    sourceName: 'BoardGameGeek',
    collection: 'Nature Incarnate openings thread',
  },
]

function readJson(fileName) {
  const fullPath = path.join(DATA_DIR, fileName)
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'))
}

function sortedUnique(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
}

function buildArchive() {
  const spirits = readJson('spirits.json')
  const aspects = readJson('aspects.json')

  const spiritExpansionBySlug = new Map(spirits.map((spirit) => [spirit.slug, spirit.expansion]))
  const aspectBySlug = new Map(aspects.map((aspect) => [aspect.slug, aspect]))

  const sources = RAW_SOURCES.map((rawSource) => {
    const entries = readJson(rawSource.file)

    const expansions = sortedUnique(
      entries.map((entry) => spiritExpansionBySlug.get(entry.spiritSlug) ?? 'unknown'),
    )

    const spiritSlugs = sortedUnique(entries.map((entry) => entry.spiritSlug))

    return {
      id: rawSource.id,
      file: rawSource.file,
      sourceType: rawSource.sourceType,
      classification: {
        source: rawSource.sourceName,
        collection: rawSource.collection,
        expansions,
      },
      entryCount: entries.length,
      spiritCount: spiritSlugs.length,
      entries,
    }
  })

  const bySpiritSlug = {}
  const byBaseSpiritSlug = {}

  for (const source of sources) {
    for (const entry of source.entries) {
      const spiritSlug = entry.spiritSlug
      const expansion = spiritExpansionBySlug.get(spiritSlug) ?? 'unknown'
      const aspect = aspectBySlug.get(spiritSlug)
      const baseSpiritSlug = aspect?.baseSpiritSlug ?? spiritSlug
      const spiritType = aspect ? 'aspect' : spiritExpansionBySlug.has(spiritSlug) ? 'base' : 'unknown'

      const lookupEntry = {
        sourceId: source.id,
        sourceFile: source.file,
        sourceType: source.sourceType,
        spiritSlug,
        baseSpiritSlug,
        spiritType,
        expansion,
        slug: entry.slug,
        name: entry.name,
        sourceUrl: entry.sourceUrl,
        author: entry.author,
      }

      if (!bySpiritSlug[spiritSlug]) {
        bySpiritSlug[spiritSlug] = []
      }
      bySpiritSlug[spiritSlug].push(lookupEntry)

      if (!byBaseSpiritSlug[baseSpiritSlug]) {
        byBaseSpiritSlug[baseSpiritSlug] = []
      }
      byBaseSpiritSlug[baseSpiritSlug].push(lookupEntry)
    }
  }

  for (const spiritSlug of Object.keys(bySpiritSlug)) {
    bySpiritSlug[spiritSlug].sort((a, b) => a.slug.localeCompare(b.slug))
  }

  for (const baseSpiritSlug of Object.keys(byBaseSpiritSlug)) {
    byBaseSpiritSlug[baseSpiritSlug].sort((a, b) => a.slug.localeCompare(b.slug))
  }

  const entryTotal = sources.reduce((sum, source) => sum + source.entryCount, 0)
  const spiritTotal = sortedUnique(
    sources.flatMap((source) => source.entries.map((entry) => entry.spiritSlug)),
  ).length
  const expansionTotal = sortedUnique(
    sources.flatMap((source) => source.classification.expansions),
  ).length

  return {
    version: 2,
    description:
      'Raw scraped opening datasets grouped by source with lookup indexes for future data enrichment.',
    generatedAt: new Date().toISOString(),
    totals: {
      sources: sources.length,
      entries: entryTotal,
      spirits: spiritTotal,
      expansions: expansionTotal,
    },
    sources,
    lookup: {
      bySpiritSlug,
      byBaseSpiritSlug,
    },
  }
}

const archive = buildArchive()
const outputPath = path.join(DATA_DIR, OUTPUT_FILE)
fs.writeFileSync(outputPath, `${JSON.stringify(archive, null, 2)}\n`)
console.log(`Wrote ${OUTPUT_FILE} with ${archive.totals.entries} entries across ${archive.totals.sources} sources.`)
