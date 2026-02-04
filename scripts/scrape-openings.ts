/**
 * Script to scrape opening guides from multiple sources
 * Primary: latentoctopus.github.io (22 turn-by-turn guides)
 * Secondary: Spirit Island Wiki strategy guides
 *
 * Run with: npx tsx scripts/scrape-openings.ts
 * Test single guide: npx tsx scripts/scrape-openings.ts --test-one
 * Dry run: npx tsx scripts/scrape-openings.ts --dry-run
 */

import * as fs from 'node:fs'
import * as https from 'node:https'
import * as path from 'node:path'
import * as cheerio from 'cheerio'

const DATA_DIR = 'scripts/data'

// =============================================================================
// TYPES
// =============================================================================

interface Turn {
  turn: number
  title?: string
  instructions: string
}

export interface ScrapedOpening {
  spiritSlug: string
  slug: string
  name: string
  description?: string
  turns: Turn[]
  author?: string
  sourceUrl: string
}

interface GuideConfig {
  path: string
  spiritSlug: string
  spiritName: string
  openingNumber: number
}

// =============================================================================
// GUIDE CONFIGURATION
// =============================================================================

// All opening guide paths from latentoctopus.github.io
// Mapped to spirit slugs matching our database
const LATENTOCTOPUS_GUIDES: GuideConfig[] = [
  // River Surges in Sunlight (1 guide)
  {
    path: '/guide/river-opening1/',
    spiritSlug: 'river-surges-in-sunlight',
    spiritName: 'River Surges in Sunlight',
    openingNumber: 1,
  },

  // Sharp Fangs Behind the Leaves (4 guides)
  {
    path: '/guide/fangs-opening1/',
    spiritSlug: 'sharp-fangs-behind-the-leaves',
    spiritName: 'Sharp Fangs Behind the Leaves',
    openingNumber: 1,
  },
  {
    path: '/guide/fangs-opening2/',
    spiritSlug: 'sharp-fangs-behind-the-leaves',
    spiritName: 'Sharp Fangs Behind the Leaves',
    openingNumber: 2,
  },
  {
    path: '/guide/fangs-opening3/',
    spiritSlug: 'sharp-fangs-behind-the-leaves',
    spiritName: 'Sharp Fangs Behind the Leaves',
    openingNumber: 3,
  },
  {
    path: '/guide/fangs-opening4/',
    spiritSlug: 'sharp-fangs-behind-the-leaves',
    spiritName: 'Sharp Fangs Behind the Leaves',
    openingNumber: 4,
  },

  // Thunderspeaker (3 guides)
  {
    path: '/guide/thunderspeaker-opening1/',
    spiritSlug: 'thunderspeaker',
    spiritName: 'Thunderspeaker',
    openingNumber: 1,
  },
  {
    path: '/guide/thunderspeaker-opening2/',
    spiritSlug: 'thunderspeaker',
    spiritName: 'Thunderspeaker',
    openingNumber: 2,
  },
  {
    path: '/guide/thunderspeaker-opening3/',
    spiritSlug: 'thunderspeaker',
    spiritName: 'Thunderspeaker',
    openingNumber: 3,
  },

  // Grinning Trickster Stirs Up Trouble (3 guides)
  {
    path: '/guide/trickster-opening1/',
    spiritSlug: 'grinning-trickster-stirs-up-trouble',
    spiritName: 'Grinning Trickster Stirs Up Trouble',
    openingNumber: 1,
  },
  {
    path: '/guide/trickster-opening2/',
    spiritSlug: 'grinning-trickster-stirs-up-trouble',
    spiritName: 'Grinning Trickster Stirs Up Trouble',
    openingNumber: 2,
  },
  {
    path: '/guide/trickster-opening3/',
    spiritSlug: 'grinning-trickster-stirs-up-trouble',
    spiritName: 'Grinning Trickster Stirs Up Trouble',
    openingNumber: 3,
  },

  // Heart of the Wildfire (2 guides)
  {
    path: '/guide/wildfire-opening1/',
    spiritSlug: 'heart-of-the-wildfire',
    spiritName: 'Heart of the Wildfire',
    openingNumber: 1,
  },
  {
    path: '/guide/wildfire-opening2/',
    spiritSlug: 'heart-of-the-wildfire',
    spiritName: 'Heart of the Wildfire',
    openingNumber: 2,
  },

  // Lure of the Deep Wilderness (2 guides)
  {
    path: '/guide/lure-opening1/',
    spiritSlug: 'lure-of-the-deep-wilderness',
    spiritName: 'Lure of the Deep Wilderness',
    openingNumber: 1,
  },
  {
    path: '/guide/lure-opening2/',
    spiritSlug: 'lure-of-the-deep-wilderness',
    spiritName: 'Lure of the Deep Wilderness',
    openingNumber: 2,
  },

  // Many Minds Move as One (2 guides)
  {
    path: '/guide/mm-opening1/',
    spiritSlug: 'many-minds-move-as-one',
    spiritName: 'Many Minds Move as One',
    openingNumber: 1,
  },
  {
    path: '/guide/mm-opening2/',
    spiritSlug: 'many-minds-move-as-one',
    spiritName: 'Many Minds Move as One',
    openingNumber: 2,
  },

  // Shroud of Silent Mist (2 guides)
  {
    path: '/guide/mist-opening1/',
    spiritSlug: 'shroud-of-silent-mist',
    spiritName: 'Shroud of Silent Mist',
    openingNumber: 1,
  },
  {
    path: '/guide/mist-opening2/',
    spiritSlug: 'shroud-of-silent-mist',
    spiritName: 'Shroud of Silent Mist',
    openingNumber: 2,
  },

  // Downpour Drenches the World (1 guide)
  {
    path: '/guide/downpour-opening1/',
    spiritSlug: 'downpour-drenches-the-world',
    spiritName: 'Downpour Drenches the World',
    openingNumber: 1,
  },

  // Ember-Eyed Behemoth (2 guides)
  {
    path: '/guide/behemoth-opening1/',
    spiritSlug: 'ember-eyed-behemoth',
    spiritName: 'Ember-Eyed Behemoth',
    openingNumber: 1,
  },
  {
    path: '/guide/behemoth-opening2/',
    spiritSlug: 'ember-eyed-behemoth',
    spiritName: 'Ember-Eyed Behemoth',
    openingNumber: 2,
  },
]

const LATENTOCTOPUS_BASE = 'https://latentoctopus.github.io'
const RATE_LIMIT_DELAY = 500

// =============================================================================
// UTILITIES
// =============================================================================

function delay(ms: number): Promise<void> {
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
            fetchPage(
              redirectUrl.startsWith('http') ? redirectUrl : `${LATENTOCTOPUS_BASE}${redirectUrl}`,
            )
              .then(resolve)
              .catch(reject)
            return
          }
        }

        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`))
          return
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

// =============================================================================
// PARSING
// =============================================================================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function parseLatentoctopusGuide(html: string, config: GuideConfig): ScrapedOpening | null {
  const $ = cheerio.load(html)

  // Get the article content
  const article = $('article').first()
  if (!article.length) {
    console.warn(`  No article found for ${config.path}`)
    return null
  }

  // Get title from h2 or article header
  let title = article.find('h2').first().text().trim()
  if (!title) {
    title = $('title').text().replace('| SI Hub', '').trim()
  }

  // Extract opening name from title
  // Titles like "Opening: Full bottom track (Minor Powers)"
  // or "Hybrid (Mixed Powers)"
  let openingName = title
  if (title.includes('Opening:')) {
    openingName = title.split('Opening:')[1].trim()
  }

  // Parse turns from the content - improved approach
  const turns: Turn[] = []
  const content = article.text()

  // Split content by turn markers to get cleaner extraction
  // Match "Turn X" or "Turn X:" patterns
  const turnSections = content.split(/(?=Turn\s+\d+[\s:—-])/i)

  for (const section of turnSections) {
    // Extract turn number from start of section
    const turnMatch = section.match(/^Turn\s+(\d+)[\s:—-]+/i)
    if (!turnMatch) continue

    const turnNum = parseInt(turnMatch[1], 10)

    // Get the content after the "Turn X:" marker
    let instructions = section
      .slice(turnMatch[0].length)
      .trim()
      // Clean up whitespace
      .replace(/\s+/g, ' ')

    // Stop at common section boundaries
    const boundaryPatterns = [
      /\s*(?:Turn\s+\d+|Key\s+(?:Advantages|Disadvantages|Considerations)|Remarks|Note:|Important:|However,\s+on)/i,
      /\s*(?:an alternative|alternatively)/i,
    ]

    for (const pattern of boundaryPatterns) {
      const boundaryMatch = instructions.match(pattern)
      if (boundaryMatch && boundaryMatch.index !== undefined) {
        // Only truncate if boundary is not at the very beginning
        if (boundaryMatch.index > 50) {
          instructions = instructions.slice(0, boundaryMatch.index).trim()
        }
      }
    }

    // Limit length but try to end at a sentence
    if (instructions.length > 400) {
      // Find last sentence end before 400 chars
      const truncated = instructions.slice(0, 400)
      const lastPeriod = truncated.lastIndexOf('.')
      if (lastPeriod > 200) {
        instructions = truncated.slice(0, lastPeriod + 1)
      } else {
        instructions = truncated.trim() + '...'
      }
    }

    // Filter out turns that are clearly notes/alternatives/tables, not actual turn instructions
    const hasTablePattern = /\d+\s+\d+\s+\d+\s+\d+\s+\d+/.test(instructions)
    const isRealTurn =
      instructions.length > 20 &&
      turnNum <= 10 &&
      !instructions.toLowerCase().startsWith('an alternative') &&
      !instructions.toLowerCase().startsWith('alternatively') &&
      !instructions.toLowerCase().startsWith('onwards') &&
      !instructions.match(/^\d+\)/) && // Filter things like "9), take a G3..."
      !hasTablePattern && // Filter table-like content
      instructions.length < 500

    if (isRealTurn) {
      turns.push({
        turn: turnNum,
        title: `Turn ${turnNum}`,
        instructions,
      })
    }
  }

  // Sort turns by number and remove duplicates
  turns.sort((a, b) => a.turn - b.turn)
  const uniqueTurns = turns.filter((t, i, arr) => i === 0 || t.turn !== arr[i - 1].turn)

  // Get description from the opening summary section
  // Usually the text before "Turn 1"
  let description = `Opening strategy for ${config.spiritName}`
  const beforeTurns = content.split(/Turn\s+1[\s:—-]/i)[0]
  if (beforeTurns) {
    // Look for a good description sentence
    const sentences = beforeTurns.split(/\.\s+/)
    for (const sentence of sentences) {
      const cleaned = sentence.replace(/\s+/g, ' ').trim()
      // Skip if it's just the title or too short
      if (
        cleaned.length > 50 &&
        cleaned.length < 300 &&
        !cleaned.includes('Unique Powers') &&
        !cleaned.includes('Spirit panel')
      ) {
        description = cleaned.endsWith('.') ? cleaned : cleaned + '.'
        break
      }
    }
  }

  // Generate slug
  const slug = `${config.spiritSlug}-opening-${config.openingNumber}`

  return {
    spiritSlug: config.spiritSlug,
    slug,
    name:
      openingName.length < 60
        ? `Opening ${config.openingNumber}: ${openingName}`
        : `Opening ${config.openingNumber}`,
    description,
    turns: uniqueTurns,
    author: 'Spirit Island Hub (latentoctopus)',
    sourceUrl: `${LATENTOCTOPUS_BASE}${config.path}`,
  }
}

// =============================================================================
// SCRAPING FUNCTIONS
// =============================================================================

async function scrapeLatentoctopusGuide(config: GuideConfig): Promise<ScrapedOpening | null> {
  const url = `${LATENTOCTOPUS_BASE}${config.path}`
  console.log(`Fetching ${config.spiritName} Opening ${config.openingNumber}...`)
  console.log(`  URL: ${url}`)

  try {
    const html = await fetchPage(url)
    const opening = parseLatentoctopusGuide(html, config)

    if (opening && opening.turns.length > 0) {
      console.log(`  SUCCESS: ${opening.turns.length} turns parsed`)
      return opening
    } else {
      console.log(`  WARNING: No turns could be parsed`)
      return null
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    console.log(`  ERROR: ${errMsg}`)
    return null
  }
}

async function scrapeAllOpenings(): Promise<ScrapedOpening[]> {
  const openings: ScrapedOpening[] = []
  const errors: string[] = []

  console.log(
    `\nScraping ${LATENTOCTOPUS_GUIDES.length} opening guides from latentoctopus.github.io...\n`,
  )

  for (const config of LATENTOCTOPUS_GUIDES) {
    const opening = await scrapeLatentoctopusGuide(config)
    if (opening) {
      openings.push(opening)
    } else {
      errors.push(`${config.spiritName} Opening ${config.openingNumber}`)
    }

    // Rate limiting
    await delay(RATE_LIMIT_DELAY)
  }

  if (errors.length > 0) {
    console.log('\n=== GUIDES WITH ISSUES ===')
    for (const err of errors) {
      console.log(`  - ${err}`)
    }
  }

  return openings
}

// =============================================================================
// MAIN
// =============================================================================

async function testOneScrape(): Promise<void> {
  console.log('Testing scrape on River Opening 1...\n')

  const config = LATENTOCTOPUS_GUIDES[0] // River Opening 1
  const opening = await scrapeLatentoctopusGuide(config)

  if (opening) {
    console.log('\n=== SCRAPED DATA ===')
    console.log(JSON.stringify(opening, null, 2))
  } else {
    console.log('\n=== SCRAPE FAILED ===')
  }
}

async function main() {
  const args = process.argv.slice(2)

  // Check for test mode
  if (args.includes('--test-one')) {
    await testOneScrape()
    return
  }

  // Ensure output directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  // Check for dry run
  if (args.includes('--dry-run')) {
    console.log('DRY RUN: Would scrape the following guides:')
    for (const config of LATENTOCTOPUS_GUIDES) {
      console.log(`  - ${config.spiritName} Opening ${config.openingNumber}: ${config.path}`)
    }
    console.log(`\nTotal: ${LATENTOCTOPUS_GUIDES.length} guides`)
    return
  }

  // Scrape all openings
  const openings = await scrapeAllOpenings()

  // Save to JSON file
  const outputPath = path.join(DATA_DIR, 'openings.json')
  fs.writeFileSync(outputPath, JSON.stringify(openings, null, 2))

  // Summary
  console.log(`\n=== COMPLETE ===`)
  console.log(`Scraped ${openings.length} opening guides`)
  console.log(`Data saved to ${outputPath}`)

  // Breakdown by spirit
  const bySpirit = new Map<string, number>()
  for (const o of openings) {
    bySpirit.set(o.spiritSlug, (bySpirit.get(o.spiritSlug) || 0) + 1)
  }

  console.log('\nGuides by spirit:')
  for (const [slug, count] of bySpirit.entries()) {
    console.log(`  - ${slug}: ${count}`)
  }
}

main()
