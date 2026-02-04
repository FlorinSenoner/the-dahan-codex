/**
 * Script to scrape spirit data from Spirit Island wiki
 * Run with: npx tsx scripts/scrape-spirits.ts
 * Test single spirit: npx tsx scripts/scrape-spirits.ts --test-one
 */

import * as fs from 'node:fs'
import * as https from 'node:https'
import * as path from 'node:path'
import * as cheerio from 'cheerio'

const WIKI_BASE = 'https://spiritislandwiki.com'
const OUTPUT_DIR = 'public/spirits'
const DATA_DIR = 'scripts/data'

// Types for scraped data
type Complexity = 'Low' | 'Moderate' | 'High' | 'Very High'
type Element = 'Sun' | 'Moon' | 'Fire' | 'Air' | 'Water' | 'Earth' | 'Plant' | 'Animal'

interface PowerRatings {
  offense: number // 0-5 scale
  defense: number
  control: number
  fear: number
  utility: number
}

export interface ScrapedSpirit {
  name: string
  slug: string
  wikiTitle: string
  imagePattern: string
  complexity: Complexity
  elements: Element[]
  summary: string
  description: string
  strengths: string[]
  weaknesses: string[]
  powerRatings: PowerRatings
  expansion: string
  wikiUrl: string
}

interface SpiritConfig {
  name: string
  wikiTitle: string
  imagePattern: string
  expansion: string
}

// All 37 spirits organized by expansion
const SPIRITS: Record<string, SpiritConfig> = {
  // ===== BASE GAME (8) =====
  'river-surges-in-sunlight': {
    name: 'River Surges in Sunlight',
    wikiTitle: 'River_Surges_in_Sunlight',
    imagePattern: 'River_Surges_in_Sunlight',
    expansion: 'base-game',
  },
  'lightnings-swift-strike': {
    name: "Lightning's Swift Strike",
    wikiTitle: 'Lightning%27s_Swift_Strike',
    imagePattern: 'Lightning%27s_Swift_Strike',
    expansion: 'base-game',
  },
  'shadows-flicker-like-flame': {
    name: 'Shadows Flicker Like Flame',
    wikiTitle: 'Shadows_Flicker_Like_Flame',
    imagePattern: 'Shadows_Flicker_Like_Flame',
    expansion: 'base-game',
  },
  'vital-strength-of-the-earth': {
    name: 'Vital Strength of the Earth',
    wikiTitle: 'Vital_Strength_of_the_Earth',
    imagePattern: 'Vital_Strength_of_the_Earth',
    expansion: 'base-game',
  },
  'a-spread-of-rampant-green': {
    name: 'A Spread of Rampant Green',
    wikiTitle: 'A_Spread_of_Rampant_Green',
    imagePattern: 'A_Spread_of_Rampant_Green',
    expansion: 'base-game',
  },
  thunderspeaker: {
    name: 'Thunderspeaker',
    wikiTitle: 'Thunderspeaker',
    imagePattern: 'Thunderspeaker',
    expansion: 'base-game',
  },
  'bringer-of-dreams-and-nightmares': {
    name: 'Bringer of Dreams and Nightmares',
    wikiTitle: 'Bringer_of_Dreams_and_Nightmares',
    imagePattern: 'Bringer_of_Dreams_and_Nightmares',
    expansion: 'base-game',
  },
  'oceans-hungry-grasp': {
    name: "Ocean's Hungry Grasp",
    wikiTitle: 'Ocean%27s_Hungry_Grasp',
    imagePattern: 'Ocean%27s_Hungry_Grasp',
    expansion: 'base-game',
  },

  // ===== BRANCH & CLAW (2) =====
  'keeper-of-the-forbidden-wilds': {
    name: 'Keeper of the Forbidden Wilds',
    wikiTitle: 'Keeper_of_the_Forbidden_Wilds',
    imagePattern: 'Keeper_of_the_Forbidden_Wilds',
    expansion: 'branch-and-claw',
  },
  'sharp-fangs-behind-the-leaves': {
    name: 'Sharp Fangs Behind the Leaves',
    wikiTitle: 'Sharp_Fangs_Behind_the_Leaves',
    imagePattern: 'Sharp_Fangs_Behind_the_Leaves',
    expansion: 'branch-and-claw',
  },

  // ===== JAGGED EARTH (10) =====
  'fractured-days-split-the-sky': {
    name: 'Fractured Days Split the Sky',
    wikiTitle: 'Fractured_Days_Split_the_Sky',
    imagePattern: 'Fractured_Days_Split_the_Sky',
    expansion: 'jagged-earth',
  },
  'starlight-seeks-its-form': {
    name: 'Starlight Seeks Its Form',
    wikiTitle: 'Starlight_Seeks_Its_Form',
    imagePattern: 'Starlight_Seeks_Its_Form',
    expansion: 'jagged-earth',
  },
  'finder-of-paths-unseen': {
    name: 'Finder of Paths Unseen',
    wikiTitle: 'Finder_of_Paths_Unseen',
    imagePattern: 'Finder_of_Paths_Unseen',
    expansion: 'jagged-earth',
  },
  'serpent-slumbering-beneath-the-island': {
    name: 'Serpent Slumbering Beneath the Island',
    wikiTitle: 'Serpent_Slumbering_Beneath_the_Island',
    imagePattern: 'Serpent_Slumbering_Beneath_the_Island',
    expansion: 'jagged-earth',
  },
  'grinning-trickster-stirs-up-trouble': {
    name: 'Grinning Trickster Stirs Up Trouble',
    wikiTitle: 'Grinning_Trickster_Stirs_Up_Trouble',
    imagePattern: 'Grinning_Trickster_Stirs_Up_Trouble',
    expansion: 'jagged-earth',
  },
  'lure-of-the-deep-wilderness': {
    name: 'Lure of the Deep Wilderness',
    wikiTitle: 'Lure_of_the_Deep_Wilderness',
    imagePattern: 'Lure_of_the_Deep_Wilderness',
    expansion: 'jagged-earth',
  },
  'many-minds-move-as-one': {
    name: 'Many Minds Move as One',
    wikiTitle: 'Many_Minds_Move_as_One',
    imagePattern: 'Many_Minds_Move_as_One',
    expansion: 'jagged-earth',
  },
  'shifting-memory-of-ages': {
    name: 'Shifting Memory of Ages',
    wikiTitle: 'Shifting_Memory_of_Ages',
    imagePattern: 'Shifting_Memory_of_Ages',
    expansion: 'jagged-earth',
  },
  'stones-unyielding-defiance': {
    name: "Stone's Unyielding Defiance",
    wikiTitle: 'Stone%27s_Unyielding_Defiance',
    imagePattern: 'Stone%27s_Unyielding_Defiance',
    expansion: 'jagged-earth',
  },
  'volcano-looming-high': {
    name: 'Volcano Looming High',
    wikiTitle: 'Volcano_Looming_High',
    imagePattern: 'Volcano_Looming_High',
    expansion: 'jagged-earth',
  },
  'shroud-of-silent-mist': {
    name: 'Shroud of Silent Mist',
    wikiTitle: 'Shroud_of_Silent_Mist',
    imagePattern: 'Shroud_of_Silent_Mist',
    expansion: 'jagged-earth',
  },
  'vengeance-as-a-burning-plague': {
    name: 'Vengeance as a Burning Plague',
    wikiTitle: 'Vengeance_as_a_Burning_Plague',
    imagePattern: 'Vengeance_as_a_Burning_Plague',
    expansion: 'jagged-earth',
  },

  // ===== FEATHER AND FLAME (2) =====
  'heart-of-the-wildfire': {
    name: 'Heart of the Wildfire',
    wikiTitle: 'Heart_of_the_Wildfire',
    imagePattern: 'Heart_of_the_Wildfire',
    expansion: 'feather-and-flame',
  },
  'downpour-drenches-the-world': {
    name: 'Downpour Drenches the World',
    wikiTitle: 'Downpour_Drenches_the_World',
    imagePattern: 'Downpour_Drenches_the_World',
    expansion: 'feather-and-flame',
  },

  // ===== HORIZONS (5) =====
  'devouring-teeth-lurk-underfoot': {
    name: 'Devouring Teeth Lurk Underfoot',
    wikiTitle: 'Devouring_Teeth_Lurk_Underfoot',
    imagePattern: 'Devouring_Teeth_Lurk_Underfoot',
    expansion: 'horizons',
  },
  'eyes-watch-from-the-trees': {
    name: 'Eyes Watch from the Trees',
    wikiTitle: 'Eyes_Watch_from_the_Trees',
    imagePattern: 'Eyes_Watch_from_the_Trees',
    expansion: 'horizons',
  },
  'fathomless-mud-of-the-swamp': {
    name: 'Fathomless Mud of the Swamp',
    wikiTitle: 'Fathomless_Mud_of_the_Swamp',
    imagePattern: 'Fathomless_Mud_of_the_Swamp',
    expansion: 'horizons',
  },
  'rising-heat-of-stone-and-sand': {
    name: 'Rising Heat of Stone and Sand',
    wikiTitle: 'Rising_Heat_of_Stone_and_Sand',
    imagePattern: 'Rising_Heat_of_Stone_and_Sand',
    expansion: 'horizons',
  },
  'sun-bright-whirlwind': {
    name: 'Sun-Bright Whirlwind',
    wikiTitle: 'Sun-Bright_Whirlwind',
    imagePattern: 'Sun-Bright_Whirlwind',
    expansion: 'horizons',
  },

  // ===== NATURE INCARNATE (8) =====
  'ember-eyed-behemoth': {
    name: 'Ember-Eyed Behemoth',
    wikiTitle: 'Ember-Eyed_Behemoth',
    imagePattern: 'Ember-Eyed_Behemoth',
    expansion: 'nature-incarnate',
  },
  'hearth-vigil': {
    name: 'Hearth-Vigil',
    wikiTitle: 'Hearth-Vigil',
    imagePattern: 'Hearth-Vigil',
    expansion: 'nature-incarnate',
  },
  'towering-roots-of-the-jungle': {
    name: 'Towering Roots of the Jungle',
    wikiTitle: 'Towering_Roots_of_the_Jungle',
    imagePattern: 'Towering_Roots_of_the_Jungle',
    expansion: 'nature-incarnate',
  },
  'breath-of-darkness-down-your-spine': {
    name: 'Breath of Darkness Down Your Spine',
    wikiTitle: 'Breath_of_Darkness_Down_Your_Spine',
    imagePattern: 'Breath_of_Darkness_Down_Your_Spine',
    expansion: 'nature-incarnate',
  },
  'relentless-gaze-of-the-sun': {
    name: 'Relentless Gaze of the Sun',
    wikiTitle: 'Relentless_Gaze_of_the_Sun',
    imagePattern: 'Relentless_Gaze_of_the_Sun',
    expansion: 'nature-incarnate',
  },
  'wandering-voice-keens-delirium': {
    name: 'Wandering Voice Keens Delirium',
    wikiTitle: 'Wandering_Voice_Keens_Delirium',
    imagePattern: 'Wandering_Voice_Keens_Delirium',
    expansion: 'nature-incarnate',
  },
  'wounded-waters-bleeding': {
    name: 'Wounded Waters Bleeding',
    wikiTitle: 'Wounded_Waters_Bleeding',
    imagePattern: 'Wounded_Waters_Bleeding',
    expansion: 'nature-incarnate',
  },
  'dances-up-earthquakes': {
    name: 'Dances Up Earthquakes',
    wikiTitle: 'Dances_Up_Earthquakes',
    imagePattern: 'Dances_Up_Earthquakes',
    expansion: 'nature-incarnate',
  },
}

// Rate limiting delay between requests (ms)
const RATE_LIMIT_DELAY = 1000

// Mapping from wiki text to complexity type
const COMPLEXITY_MAP: Record<string, Complexity> = {
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
  'very high': 'Very High',
}

// Mapping from wiki power rating text to numeric scale
const POWER_RATING_MAP: Record<string, number> = {
  low: 1,
  'medium-low': 2,
  medium: 3,
  'medium-high': 4,
  high: 5,
  // Handle alternate spellings
  'med-low': 2,
  'med-high': 4,
  medlow: 2,
  medhigh: 4,
}

// Valid elements
const VALID_ELEMENTS: Element[] = [
  'Sun',
  'Moon',
  'Fire',
  'Air',
  'Water',
  'Earth',
  'Plant',
  'Animal',
]

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

async function downloadImage(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Build full URL - handle relative paths
    let fullUrl: string
    if (url.startsWith('http')) {
      fullUrl = url
    } else if (url.startsWith('//')) {
      fullUrl = `https:${url}`
    } else if (url.startsWith('/')) {
      fullUrl = `${WIKI_BASE}${url}`
    } else {
      fullUrl = `${WIKI_BASE}/${url}`
    }

    console.log(`  Full URL: ${fullUrl}`)

    https
      .get(fullUrl, (res) => {
        // Handle redirects
        if (res.statusCode === 301 || res.statusCode === 302) {
          const redirectUrl = res.headers.location
          if (redirectUrl) {
            downloadImage(redirectUrl, dest).then(resolve).catch(reject)
            return
          }
        }

        // Check for errors
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${fullUrl}`))
          return
        }

        const file = fs.createWriteStream(dest)
        res.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve()
        })
        file.on('error', (err) => {
          fs.unlink(dest, () => {}) // Delete partial file
          reject(err)
        })
      })
      .on('error', reject)
  })
}

function parseComplexity($: cheerio.CheerioAPI, html: string): Complexity {
  // Strategy 1: Parse wgCategories from the embedded JSON in the page
  // Format: "wgCategories":["Spirits","Low Complexity Spirits","Base Game"]
  const categoriesMatch = html.match(/"wgCategories":\s*\[([^\]]+)\]/)
  if (categoriesMatch) {
    const categoriesText = categoriesMatch[1].toLowerCase()
    if (categoriesText.includes('very high complexity')) {
      return 'Very High'
    }
    if (categoriesText.includes('high complexity')) {
      return 'High'
    }
    if (categoriesText.includes('moderate complexity')) {
      return 'Moderate'
    }
    if (categoriesText.includes('low complexity')) {
      return 'Low'
    }
  }

  // Strategy 2: Look for complexity badge in the content (e.g., "LOW", "HIGH")
  const bodyText = $('body').text()
  const complexityMatch = bodyText.match(
    /\b(LOW|MODERATE|HIGH|VERY HIGH)\b(?=\s*(?:complexity|$))/i,
  )
  if (complexityMatch) {
    const level = complexityMatch[1].toLowerCase()
    if (level === 'very high') return 'Very High'
    if (level === 'high') return 'High'
    if (level === 'moderate') return 'Moderate'
    if (level === 'low') return 'Low'
  }

  // Strategy 3: Look in category links at bottom of page
  const categoryLinks = $('#catlinks').text().toLowerCase()
  if (categoryLinks.includes('very high complexity')) return 'Very High'
  if (categoryLinks.includes('high complexity')) return 'High'
  if (categoryLinks.includes('moderate complexity')) return 'Moderate'
  if (categoryLinks.includes('low complexity')) return 'Low'

  // Default to Moderate if not found
  console.warn('  Warning: Could not find complexity, defaulting to Moderate')
  return 'Moderate'
}

function parseElements($: cheerio.CheerioAPI): Element[] {
  const elements: Set<Element> = new Set()
  const elementCounts: Map<Element, number> = new Map()

  // Look for element icons in the page - count occurrences to find primary elements
  $('img').each((_, el) => {
    const alt = $(el).attr('alt')?.toLowerCase() || ''
    const src = $(el).attr('src')?.toLowerCase() || ''

    for (const elem of VALID_ELEMENTS) {
      const elemLower = elem.toLowerCase()
      // Match element icons (e.g., "Sun.png", "sun" in alt text)
      // Be careful not to match "sunlight" which is part of spirit names
      if (
        alt === `${elemLower}.png` ||
        alt === elemLower ||
        src.includes(`/${elemLower}.png`) ||
        src.includes(`/${elemLower}_`)
      ) {
        const count = elementCounts.get(elem) || 0
        elementCounts.set(elem, count + 1)
      }
    }
  })

  // Take elements that appear multiple times (likely in innate powers or presence track)
  // Primary elements typically appear 3+ times on a spirit page
  for (const [elem, count] of elementCounts.entries()) {
    if (count >= 2) {
      elements.add(elem)
    }
  }

  // If we found too few elements, lower the threshold
  if (elements.size < 2) {
    for (const [elem, count] of elementCounts.entries()) {
      if (count >= 1) {
        elements.add(elem)
      }
    }
  }

  return Array.from(elements)
}

function parsePowerRatings($: cheerio.CheerioAPI): PowerRatings {
  const ratings: PowerRatings = {
    offense: 0,
    defense: 0,
    control: 0,
    fear: 0,
    utility: 0,
  }

  // The wiki uses a visual bar chart for power summary
  // Each column has colored cells - count how many are colored to get the rating
  // The order is: Offense, Control, Fear, Defense, Utility
  // Gray/empty cells have ##f2f5f7 or #f2f5f7, colored cells have other colors

  // Find the power summary table after "SUMMARY OF POWERS"
  const summaryHeader = $("b:contains('SUMMARY OF POWERS')")
  if (summaryHeader.length > 0) {
    // Find the table immediately after the header
    const table = summaryHeader.closest('p').nextAll('table').first()
    if (table.length > 0) {
      // Count colored cells in each column (columns 0-4 map to Offense, Control, Fear, Defense, Utility)
      const columnColors: number[] = [0, 0, 0, 0, 0]

      table.find('tr').each((_, row) => {
        $(row)
          .find('td')
          .each((colIdx, cell) => {
            if (colIdx < 5) {
              const style = $(cell).attr('style') || ''
              // Check if the cell has a non-gray background color
              // Gray/white cells use ##f2f5f7 or #f2f5f7 (note double # is a wiki typo)
              // Colored cells have other hex colors like #45653c, #4b7364, etc.
              const bgMatch = style.match(/background-color:\s*(#[0-9a-f]+)/i)
              if (bgMatch) {
                const color = bgMatch[1].toLowerCase()
                // Check if it's NOT a gray/empty cell
                if (color !== '#f2f5f7' && !style.includes('##f2f5f7')) {
                  columnColors[colIdx]++
                }
              }
            }
          })
      })

      // Map to 0-5 scale - column order is Offense, Control, Fear, Defense, Utility
      ratings.offense = Math.min(5, columnColors[0])
      ratings.control = Math.min(5, columnColors[1])
      ratings.fear = Math.min(5, columnColors[2])
      ratings.defense = Math.min(5, columnColors[3])
      ratings.utility = Math.min(5, columnColors[4])
    }
  }

  // If we couldn't parse the visual chart, leave as 0 (will need manual review)
  return ratings
}

function parseStrengthsWeaknesses($: cheerio.CheerioAPI): {
  strengths: string[]
  weaknesses: string[]
} {
  const strengths: string[] = []
  const weaknesses: string[] = []

  // Look for strategy section with strengths/weaknesses
  $('h2, h3, h4').each((_, el) => {
    const heading = $(el).text().toLowerCase()

    if (heading.includes('strength')) {
      // Get the next ul element
      const list = $(el).nextAll('ul').first()
      list.find('li').each((_, li) => {
        const text = $(li).text().trim()
        if (text && text.length < 200) {
          strengths.push(text)
        }
      })
    }

    if (heading.includes('weakness')) {
      const list = $(el).nextAll('ul').first()
      list.find('li').each((_, li) => {
        const text = $(li).text().trim()
        if (text && text.length < 200) {
          weaknesses.push(text)
        }
      })
    }
  })

  return { strengths, weaknesses }
}

function parseSummaryAndDescription(
  $: cheerio.CheerioAPI,
  spiritName: string,
): { summary: string; description: string } {
  let summary = ''
  let description = ''

  // Get the main content area
  const content = $('#mw-content-text')

  // Find paragraphs that aren't in tables or infoboxes
  const paragraphs: string[] = []
  content.find('p').each((_, el) => {
    // Skip paragraphs inside tables or infoboxes
    if ($(el).closest('.infobox, table').length === 0) {
      const text = $(el).text().trim()
      if (text && text.length > 50) {
        paragraphs.push(text)
      }
    }
  })

  // First substantial paragraph becomes the summary (truncated to 150 chars)
  if (paragraphs.length > 0) {
    const firstPara = paragraphs[0]
    summary = firstPara.length > 150 ? firstPara.substring(0, 147) + '...' : firstPara
  }

  // First 2-3 paragraphs become description (up to 500 chars)
  if (paragraphs.length > 0) {
    const descText = paragraphs.slice(0, 3).join(' ')
    description = descText.length > 500 ? descText.substring(0, 497) + '...' : descText
  }

  // Fallback: use spirit name as placeholder
  if (!summary) {
    summary = `${spiritName} is a spirit in Spirit Island.`
  }
  if (!description) {
    description = `${spiritName} is a spirit in Spirit Island. Visit the wiki for more details.`
  }

  return { summary, description }
}

async function scrapeSpirit(slug: string, config: SpiritConfig): Promise<ScrapedSpirit> {
  const wikiUrl = `${WIKI_BASE}/index.php?title=${config.wikiTitle}`
  console.log(`Fetching ${config.name}...`)
  console.log(`  URL: ${wikiUrl}`)

  const html = await fetchPage(wikiUrl)
  const $ = cheerio.load(html)

  // Parse all the metadata
  const complexity = parseComplexity($, html)
  console.log(`  Complexity: ${complexity}`)

  const elements = parseElements($)
  console.log(`  Elements: ${elements.join(', ') || 'none found'}`)

  const powerRatings = parsePowerRatings($)
  console.log(
    `  Power Ratings: O:${powerRatings.offense} D:${powerRatings.defense} C:${powerRatings.control} F:${powerRatings.fear} U:${powerRatings.utility}`,
  )

  const { strengths, weaknesses } = parseStrengthsWeaknesses($)
  console.log(`  Strengths: ${strengths.length}, Weaknesses: ${weaknesses.length}`)

  const { summary, description } = parseSummaryAndDescription($, config.name)
  console.log(`  Summary: ${summary.substring(0, 50)}...`)

  return {
    name: config.name,
    slug,
    wikiTitle: config.wikiTitle,
    imagePattern: config.imagePattern,
    complexity,
    elements,
    summary,
    description,
    strengths,
    weaknesses,
    powerRatings,
    expansion: config.expansion,
    wikiUrl,
  }
}

async function scrapeAllSpirits(): Promise<ScrapedSpirit[]> {
  const spirits: ScrapedSpirit[] = []
  const errors: { slug: string; error: string }[] = []

  const entries = Object.entries(SPIRITS)
  console.log(`\nScraping ${entries.length} spirits...\n`)

  for (const [slug, config] of entries) {
    try {
      const spirit = await scrapeSpirit(slug, config)
      spirits.push(spirit)
      console.log(`  SUCCESS: ${config.name}\n`)
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error)
      console.error(`  ERROR: ${config.name} - ${errMsg}\n`)
      errors.push({ slug, error: errMsg })
    }

    // Rate limiting - wait between requests
    await delay(RATE_LIMIT_DELAY)
  }

  if (errors.length > 0) {
    console.log('\n=== ERRORS ===')
    for (const { slug, error } of errors) {
      console.log(`  ${slug}: ${error}`)
    }
  }

  return spirits
}

async function testOneScrape(): Promise<void> {
  console.log('Testing scrape on River Surges in Sunlight...\n')

  const config = SPIRITS['river-surges-in-sunlight']
  const spirit = await scrapeSpirit('river-surges-in-sunlight', config)

  console.log('\n=== SCRAPED DATA ===')
  console.log(JSON.stringify(spirit, null, 2))
}

async function main() {
  const args = process.argv.slice(2)

  // Check for test mode
  if (args.includes('--test-one')) {
    await testOneScrape()
    return
  }

  // Ensure output directories exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  // Scrape all spirits
  const spirits = await scrapeAllSpirits()

  // Save to JSON file
  const outputPath = path.join(DATA_DIR, 'spirits.json')
  fs.writeFileSync(outputPath, JSON.stringify(spirits, null, 2))

  console.log(`\n=== COMPLETE ===`)
  console.log(`Scraped ${spirits.length} spirits`)
  console.log(`Data saved to ${outputPath}`)
  console.log('\nReview the JSON file before seeding to database.')
}

main()
