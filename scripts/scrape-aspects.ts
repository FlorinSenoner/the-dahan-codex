/**
 * Script to scrape spirit aspect data from Spirit Island wiki
 * Run with: npx tsx scripts/scrape-aspects.ts
 *
 * CLI flags:
 *   --test-one    Scrape single aspect for testing
 *   --dry-run     List what would be scraped without actually scraping
 */

import * as fs from 'node:fs'
import * as https from 'node:https'
import * as path from 'node:path'
import * as cheerio from 'cheerio'

const WIKI_BASE = 'https://spiritislandwiki.com'
const OUTPUT_FILE = 'scripts/data/aspects.json'

// Rate limiting delay between requests (ms)
const REQUEST_DELAY = 500

// ----- Types -----

interface ScrapedAspect {
  name: string // "Sunshine", "Pandemonium"
  baseSpiritSlug: string // "river-surges-in-sunlight"
  slug: string // Full URL slug: "river-surges-in-sunlight-sunshine"
  summary: string // Brief description
  expansion: string // Expansion slug
  complexityModifier: 'easier' | 'same' | 'harder'
  hasUniqueImage: boolean
  wikiUrl: string
  imagePattern?: string // If has unique image
}

interface AspectDefinition {
  name: string
  baseSpiritName: string
}

// ----- Spirit Name to Slug Mapping -----

const SPIRIT_NAME_TO_SLUG: Record<string, string> = {
  "Lightning's Swift Strike": 'lightnings-swift-strike',
  'River Surges in Sunlight': 'river-surges-in-sunlight',
  'Shadows Flicker Like Flame': 'shadows-flicker-like-flame',
  'Vital Strength of the Earth': 'vital-strength-of-the-earth',
  'A Spread of Rampant Green': 'a-spread-of-rampant-green',
  'Bringer of Dreams and Nightmares': 'bringer-of-dreams-and-nightmares',
  'Heart of the Wildfire': 'heart-of-the-wildfire',
  'Keeper of the Forbidden Wilds': 'keeper-of-the-forbidden-wilds',
  'Lure of the Deep Wilderness': 'lure-of-the-deep-wilderness',
  "Ocean's Hungry Grasp": 'oceans-hungry-grasp',
  'Serpent Slumbering Beneath the Island': 'serpent-slumbering-beneath-the-island',
  'Sharp Fangs Behind the Leaves': 'sharp-fangs-behind-the-leaves',
  'Shifting Memory of Ages': 'shifting-memory-of-ages',
  'Shroud of Silent Mist': 'shroud-of-silent-mist',
  Thunderspeaker: 'thunderspeaker',
}

// ----- All 31 Aspects -----

const ASPECTS: AspectDefinition[] = [
  // Lightning's Swift Strike (4 aspects)
  { name: 'Pandemonium', baseSpiritName: "Lightning's Swift Strike" },
  { name: 'Wind', baseSpiritName: "Lightning's Swift Strike" },
  { name: 'Immense', baseSpiritName: "Lightning's Swift Strike" },
  { name: 'Sparking', baseSpiritName: "Lightning's Swift Strike" },

  // River Surges in Sunlight (3 aspects)
  { name: 'Sunshine', baseSpiritName: 'River Surges in Sunlight' },
  { name: 'Travel', baseSpiritName: 'River Surges in Sunlight' },
  { name: 'Haven', baseSpiritName: 'River Surges in Sunlight' },

  // Shadows Flicker Like Flame (5 aspects)
  { name: 'Madness', baseSpiritName: 'Shadows Flicker Like Flame' },
  { name: 'Reach', baseSpiritName: 'Shadows Flicker Like Flame' },
  { name: 'Amorphous', baseSpiritName: 'Shadows Flicker Like Flame' },
  { name: 'Foreboding', baseSpiritName: 'Shadows Flicker Like Flame' },
  { name: 'Dark Fire', baseSpiritName: 'Shadows Flicker Like Flame' },

  // Vital Strength of the Earth (3 aspects)
  { name: 'Resilience', baseSpiritName: 'Vital Strength of the Earth' },
  { name: 'Might', baseSpiritName: 'Vital Strength of the Earth' },
  { name: 'Nourishing', baseSpiritName: 'Vital Strength of the Earth' },

  // A Spread of Rampant Green (2 aspects)
  { name: 'Regrowth', baseSpiritName: 'A Spread of Rampant Green' },
  { name: 'Tangles', baseSpiritName: 'A Spread of Rampant Green' },

  // Bringer of Dreams and Nightmares (2 aspects)
  { name: 'Enticing', baseSpiritName: 'Bringer of Dreams and Nightmares' },
  { name: 'Violence', baseSpiritName: 'Bringer of Dreams and Nightmares' },

  // Heart of the Wildfire (1 aspect)
  { name: 'Transforming', baseSpiritName: 'Heart of the Wildfire' },

  // Keeper of the Forbidden Wilds (1 aspect)
  {
    name: 'Spreading Hostility',
    baseSpiritName: 'Keeper of the Forbidden Wilds',
  },

  // Lure of the Deep Wilderness (1 aspect)
  { name: 'Lair', baseSpiritName: 'Lure of the Deep Wilderness' },

  // Ocean's Hungry Grasp (1 aspect)
  { name: 'Deeps', baseSpiritName: "Ocean's Hungry Grasp" },

  // Serpent Slumbering Beneath the Island (1 aspect)
  { name: 'Locus', baseSpiritName: 'Serpent Slumbering Beneath the Island' },

  // Sharp Fangs Behind the Leaves (2 aspects)
  { name: 'Encircle', baseSpiritName: 'Sharp Fangs Behind the Leaves' },
  { name: 'Unconstrained', baseSpiritName: 'Sharp Fangs Behind the Leaves' },

  // Shifting Memory of Ages (2 aspects)
  { name: 'Intensify', baseSpiritName: 'Shifting Memory of Ages' },
  { name: 'Mentor', baseSpiritName: 'Shifting Memory of Ages' },

  // Shroud of Silent Mist (1 aspect)
  { name: 'Stranded', baseSpiritName: 'Shroud of Silent Mist' },

  // Thunderspeaker (2 aspects)
  { name: 'Tactician', baseSpiritName: 'Thunderspeaker' },
  { name: 'Warrior', baseSpiritName: 'Thunderspeaker' },
]

// ----- Utility Functions -----

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchPage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        // Handle redirects
        if (res.statusCode === 301 || res.statusCode === 302) {
          const redirectUrl = res.headers.location
          if (redirectUrl) {
            fetchPage(redirectUrl.startsWith('http') ? redirectUrl : `${WIKI_BASE}${redirectUrl}`)
              .then(resolve)
              .catch(reject)
            return
          }
        }
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => resolve(data))
        res.on('error', reject)
      })
      .on('error', reject)
  })
}

function getBaseSpiritSlug(baseSpiritName: string): string {
  const slug = SPIRIT_NAME_TO_SLUG[baseSpiritName]
  if (!slug) {
    throw new Error(`Unknown base spirit: ${baseSpiritName}`)
  }
  return slug
}

function generateAspectSlug(baseSpiritSlug: string, aspectName: string): string {
  const aspectPart = aspectName.toLowerCase().replace(/\s+/g, '-')
  return `${baseSpiritSlug}-${aspectPart}`
}

function parseComplexityModifier(text: string): 'easier' | 'same' | 'harder' {
  const lower = text.toLowerCase()
  // Wiki uses: "Higher Complexity", "Lower Complexity", "No Change"
  if (
    lower.includes('higher') ||
    lower.includes('increases complexity') ||
    lower.includes('harder') ||
    lower.includes('more complex')
  ) {
    return 'harder'
  }
  if (
    lower.includes('lower') ||
    lower.includes('decreases complexity') ||
    lower.includes('easier') ||
    lower.includes('less complex') ||
    lower.includes('simpler')
  ) {
    return 'easier'
  }
  // "no change", "same complexity", or absent
  return 'same'
}

// ----- Scraping Functions -----

interface AspectListEntry {
  aspectName: string
  baseSpiritName: string
  expansion: string
  wikiPageTitle: string
}

async function scrapeAspectListPage(): Promise<AspectListEntry[]> {
  const url = `${WIKI_BASE}/index.php?title=List_of_Aspect_Cards`
  console.log(`Fetching aspect list page: ${url}`)

  const html = await fetchPage(url)
  const $ = cheerio.load(html)

  const entries: AspectListEntry[] = []

  // The wiki table structure:
  // Column 0 (Box Art): Contains expansion link with title attribute
  // Column 1 (Aspect Art): Contains aspect image
  // Column 2 (Spirit): Contains spirit name link
  // Column 3 (Aspect Name): Contains aspect name link
  $('table.wikitable.sortable tbody tr').each((_, row) => {
    const cells = $(row).find('td')
    if (cells.length < 4) return // Skip header rows

    // Cell 0: Box art - extract expansion from the first link's title attribute
    const expansionLinks = $(cells[0]).find('a[title]')
    let expansion = ''
    expansionLinks.each((_, link) => {
      const title = $(link).attr('title') || ''
      // Take the first expansion link that's not empty
      if (!expansion && title && !title.includes('File:')) {
        expansion = title
      }
    })

    // Cell 2: Spirit name - get from the last link text (not the image link)
    const spiritLinks = $(cells[2]).find('a[title]')
    let baseSpiritName = ''
    spiritLinks.each((_, link) => {
      const title = $(link).attr('title') || ''
      // Skip file links
      if (!title.includes('File:')) {
        baseSpiritName = title
      }
    })

    // Cell 3: Aspect name - get from link text
    const aspectLink = $(cells[3]).find('a').first()
    const aspectName = aspectLink.text().trim() || $(cells[3]).text().trim()
    const wikiPageTitle = aspectLink.attr('href')?.replace('/index.php?title=', '') || ''

    if (aspectName && baseSpiritName) {
      entries.push({
        aspectName,
        baseSpiritName,
        expansion,
        wikiPageTitle,
      })
    }
  })

  console.log(`Found ${entries.length} aspects in list page`)
  return entries
}

async function scrapeAspectPage(
  aspectName: string,
  wikiPageTitle: string,
): Promise<{
  summary: string
  hasUniqueImage: boolean
  imagePattern?: string
  complexityText: string
}> {
  // Use the wiki page title from the list page - aspects use just their name as the page title
  const url = `${WIKI_BASE}/index.php?title=${wikiPageTitle || encodeURIComponent(aspectName)}`
  console.log(`  Fetching aspect page: ${aspectName} (${wikiPageTitle || aspectName})`)

  try {
    const html = await fetchPage(url)
    const $ = cheerio.load(html)

    // Check if page exists
    if ($('.noarticletext').length > 0) {
      console.log(`    No dedicated page found for ${aspectName}`)
      return { summary: '', hasUniqueImage: false, complexityText: '' }
    }

    // Get complexity from infobox - look for row with "Complexity" cell
    let complexityText = ''
    $('table tr').each((_, row) => {
      const cells = $(row).find('td')
      if (cells.length >= 2) {
        const label = $(cells[0]).text().trim()
        if (label.toLowerCase() === 'complexity') {
          complexityText = $(cells[1]).text().trim()
        }
      }
    })

    // Get summary from first paragraph after the infobox
    let summary = ''
    const content = $('.mw-parser-output')
    content.find('p').each((_, p) => {
      if (!summary) {
        const text = $(p).text().trim()
        // Skip empty or navigation paragraphs
        if (text && text.length > 20 && !text.includes('[edit]')) {
          summary = text
        }
      }
    })

    // Check for unique aspect image
    let hasUniqueImage = false
    let imagePattern: string | undefined

    // Look for an image that contains the aspect name
    $('img').each((_, img) => {
      const alt = $(img).attr('alt') || ''
      const src = $(img).attr('src') || ''
      if (
        alt.toLowerCase().includes(aspectName.toLowerCase()) ||
        src.toLowerCase().includes(aspectName.toLowerCase().replace(/\s+/g, '_'))
      ) {
        hasUniqueImage = true
        imagePattern = alt || path.basename(src)
      }
    })

    return { summary, hasUniqueImage, imagePattern, complexityText }
  } catch (error) {
    console.log(`    Error fetching aspect page: ${error}`)
    return { summary: '', hasUniqueImage: false, complexityText: '' }
  }
}

// Map expansion names from wiki to our slugs
function mapExpansionToSlug(expansionName: string): string {
  const mapping: Record<string, string> = {
    'Base Game': 'base-game',
    'Branch & Claw': 'branch-and-claw',
    'Jagged Earth': 'jagged-earth',
    'Feather & Flame': 'feather-and-flame',
    'Feather and Flame': 'feather-and-flame',
    'Nature Incarnate': 'nature-incarnate',
    Horizons: 'horizons',
    'Horizons of Spirit Island': 'horizons',
    'Promo Pack 1': 'promo-pack-1',
    'Promo Pack 2': 'promo-pack-2',
  }

  return mapping[expansionName] || expansionName.toLowerCase().replace(/\s+/g, '-')
}

async function scrapeAllAspects(testOne = false): Promise<ScrapedAspect[]> {
  const scrapedAspects: ScrapedAspect[] = []
  const errors: string[] = []

  // First, try to get data from the list page
  let listEntries: AspectListEntry[] = []
  try {
    listEntries = await scrapeAspectListPage()
  } catch (error) {
    console.log(`Warning: Could not fetch list page: ${error}`)
  }

  // Create a lookup map from list entries
  const listLookup = new Map<string, AspectListEntry>()
  for (const entry of listEntries) {
    const key = `${entry.aspectName}|${entry.baseSpiritName}`
    listLookup.set(key, entry)
  }

  const aspectsToProcess = testOne ? [ASPECTS[0]] : ASPECTS

  for (const aspect of aspectsToProcess) {
    try {
      console.log(`\nProcessing: ${aspect.name} (${aspect.baseSpiritName})`)

      const baseSpiritSlug = getBaseSpiritSlug(aspect.baseSpiritName)
      const slug = generateAspectSlug(baseSpiritSlug, aspect.name)

      // Get data from list page lookup
      const listEntry = listLookup.get(`${aspect.name}|${aspect.baseSpiritName}`)

      // Scrape individual aspect page for summary, image info, and complexity
      await sleep(REQUEST_DELAY)
      const wikiPageTitle = listEntry?.wikiPageTitle || aspect.name
      const pageData = await scrapeAspectPage(aspect.name, wikiPageTitle)

      // Determine complexity modifier from individual page's infobox
      let complexityModifier: 'easier' | 'same' | 'harder' = 'same'
      if (pageData.complexityText) {
        complexityModifier = parseComplexityModifier(pageData.complexityText)
      }

      // Determine expansion from list page
      let expansion = 'jagged-earth' // Default - most aspects are from Jagged Earth
      if (listEntry?.expansion) {
        expansion = mapExpansionToSlug(listEntry.expansion)
      }

      // Use the actual wiki page URL
      const wikiUrl = `${WIKI_BASE}/index.php?title=${wikiPageTitle}`

      const scrapedAspect: ScrapedAspect = {
        name: aspect.name,
        baseSpiritSlug,
        slug,
        summary: pageData.summary,
        expansion,
        complexityModifier,
        hasUniqueImage: pageData.hasUniqueImage,
        wikiUrl,
        ...(pageData.imagePattern && { imagePattern: pageData.imagePattern }),
      }

      scrapedAspects.push(scrapedAspect)
      console.log(`  Done: ${slug} (${complexityModifier})`)
    } catch (error) {
      const errorMsg = `Error processing ${aspect.name}: ${error}`
      console.error(`  ${errorMsg}`)
      errors.push(errorMsg)
    }
  }

  if (errors.length > 0) {
    console.log(`\n${errors.length} errors occurred:`)
    for (const err of errors) {
      console.log(`  - ${err}`)
    }
  }

  return scrapedAspects
}

// ----- Main -----

async function main() {
  const args = process.argv.slice(2)
  const testOne = args.includes('--test-one')
  const dryRun = args.includes('--dry-run')

  console.log('=== Spirit Island Aspect Scraper ===\n')

  if (dryRun) {
    console.log('Dry run mode - listing aspects to scrape:\n')
    for (const aspect of ASPECTS) {
      const baseSpiritSlug = getBaseSpiritSlug(aspect.baseSpiritName)
      const slug = generateAspectSlug(baseSpiritSlug, aspect.name)
      console.log(`  ${slug}`)
      console.log(`    Base: ${aspect.baseSpiritName}`)
      console.log(`    Aspect: ${aspect.name}`)
    }
    console.log(`\nTotal: ${ASPECTS.length} aspects`)
    return
  }

  if (testOne) {
    console.log('Test mode - scraping single aspect\n')
  }

  const aspects = await scrapeAllAspects(testOne)

  console.log(`\n=== Results ===`)
  console.log(`Scraped ${aspects.length} aspects`)

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Write to JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(aspects, null, 2))
  console.log(`\nSaved to ${OUTPUT_FILE}`)

  // Verify output
  console.log('\n=== Verification ===')
  console.log(`Total aspects: ${aspects.length} (expected: 31)`)

  const byComplexity = {
    easier: aspects.filter((a) => a.complexityModifier === 'easier').length,
    same: aspects.filter((a) => a.complexityModifier === 'same').length,
    harder: aspects.filter((a) => a.complexityModifier === 'harder').length,
  }
  console.log(
    `By complexity: easier=${byComplexity.easier}, same=${byComplexity.same}, harder=${byComplexity.harder}`,
  )

  // Check for duplicates
  const slugs = aspects.map((a) => a.slug)
  const uniqueSlugs = new Set(slugs)
  if (slugs.length !== uniqueSlugs.size) {
    console.log('WARNING: Duplicate slugs detected!')
  } else {
    console.log('No duplicates found')
  }

  // Check all have required fields
  const missingFields = aspects.filter(
    (a) => !a.name || !a.baseSpiritSlug || !a.complexityModifier || !a.expansion,
  )
  if (missingFields.length > 0) {
    console.log(`WARNING: ${missingFields.length} aspects missing required fields`)
  } else {
    console.log('All aspects have required fields')
  }
}

main().catch(console.error)
