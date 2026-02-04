# Phase 8: Spirit & Aspect Data Scraping - Research

**Researched:** 2026-02-02
**Domain:** Web scraping, data population, Spirit Island community resources
**Confidence:** HIGH

## Summary

Phase 8 focuses on populating complete spirit and aspect data by scraping authoritative sources, primarily the Spirit Island wiki at spiritislandwiki.com. The existing codebase already has a proven scraping pattern using Node.js native https module + Cheerio for HTML parsing (see `scripts/scrape-spirits.ts`). This phase extends that pattern to scrape all 37 spirits, their aspects (31 total), and populate opening guides from community sources.

The wiki follows MediaWiki structure with predictable URL patterns. Spirit images are available at 600px width as PNGs. Power ratings use a 0-5 scale (matching the project's existing schema). The main challenge is structuring the seeding script to be repeatable for future updates without losing user-contributed data like openings.

**Primary recommendation:** Extend the existing `scripts/scrape-spirits.ts` to scrape all 37 spirits and 31 aspects, then populate opening guides manually from curated community sources (BGG, Spirit Island Hub) rather than automated scraping.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| cheerio | ^1.2.0 | HTML parsing | Already installed, jQuery-like API, handles malformed HTML well |
| node:https | built-in | HTTP requests | Already used, no additional dependency, handles redirects |
| node:fs | built-in | File I/O | Already used for writing images to disk |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tsx | ^4.21.0 | TypeScript execution | Already installed for running scripts |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| node:https | axios or node-fetch | More features but adds dependency; native https is sufficient |
| cheerio | puppeteer | Puppeteer handles JS-rendered pages but wiki is static HTML |
| manual scraping | MediaWiki API | API gives structured data but wiki's API may be limited; HTML scraping gives full content |

**Installation:**
```bash
# All dependencies already installed - no new packages needed
```

## Architecture Patterns

### Recommended Project Structure
```
scripts/
├── scrape-spirits.ts       # Existing - extend for all spirits
├── scrape-aspects.ts       # NEW - scrape aspect card data
└── data/
    └── spirits.json        # NEW - scraped data cache for review before seeding

convex/
├── seed.ts                 # Existing - contains EXPANSIONS, SPIRITS data
└── seed-data/
    └── spirits.ts          # NEW - extracted spirit data definitions

public/spirits/
├── {slug}.png              # Base spirit images
└── {slug}-{aspect}.png     # Aspect images
```

### Pattern 1: Scrape to JSON, Review, then Seed
**What:** Scrape data to local JSON file, manually review for accuracy, then seed to Convex
**When to use:** All scraped data before it goes to production
**Example:**
```typescript
// scripts/scrape-spirits.ts
interface ScrapedSpirit {
  name: string;
  slug: string;
  complexity: "Low" | "Moderate" | "High" | "Very High";
  elements: string[];
  summary: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  powerRatings: {
    offense: number;  // 0-5 scale
    defense: number;
    control: number;
    fear: number;
    utility: number;
  };
  wikiUrl: string;
  imageFilename: string;
  expansion: string;
}

// Output to scripts/data/spirits.json for review
```

### Pattern 2: Idempotent Seeding with reseedSpirits
**What:** Use existing reseedSpirits mutation that clears and re-inserts all data
**When to use:** When spirit data changes and needs full refresh
**Example:**
```typescript
// Existing pattern in convex/seed.ts
export const reseedSpirits = mutation({
  handler: async (ctx) => {
    await clearExistingData(ctx);  // Deletes openings, spirits, expansions
    await insertSeedData(ctx);
  },
});
```

### Pattern 3: Image Download with Redirect Handling
**What:** Handle wiki's redirect-heavy image URLs
**When to use:** All image downloads
**Example:**
```typescript
// Existing pattern in scripts/scrape-spirits.ts
async function downloadImage(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(fullUrl, (res) => {
      // Handle 301/302 redirects recursively
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          downloadImage(redirectUrl, dest).then(resolve).catch(reject);
          return;
        }
      }
      // Write to file
      const file = fs.createWriteStream(dest);
      res.pipe(file);
    });
  });
}
```

### Anti-Patterns to Avoid
- **Scraping directly to database:** Always review scraped data before seeding
- **Hardcoding image URLs:** Wiki URLs change; scrape dynamically from page content
- **Single-run scripts:** Make scripts idempotent and repeatable
- **Ignoring rate limits:** Add delays between requests to avoid overloading wiki

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| HTML parsing | Custom regex | Cheerio | Wiki HTML is complex; regex breaks easily |
| Image redirect handling | Simple fetch | Recursive redirect handler | Wiki uses multiple redirects |
| Slug generation | Manual string replace | Existing slug pattern | Consistency with current data |
| Power rating parsing | Visual estimation | Wiki template data | Wiki has numeric values in templates |

**Key insight:** The wiki uses MediaWiki templates that embed structured data in HTML attributes and specific CSS classes. Parsing these consistently requires a DOM parser like Cheerio, not regex.

## Common Pitfalls

### Pitfall 1: Wiki Image URL Complexity
**What goes wrong:** Images have multiple URL formats (thumb, full, srcset) and redirect chains
**Why it happens:** MediaWiki generates different URLs for different display sizes
**How to avoid:** Use srcset parsing to find full-resolution URL, handle redirects recursively
**Warning signs:** 404 errors, tiny thumbnails instead of full images

### Pitfall 2: Character Encoding in Names
**What goes wrong:** Names with apostrophes (Lightning's) or special chars get mangled
**Why it happens:** URL encoding varies between page title and file names
**How to avoid:** Use encodeURIComponent() consistently, test with "Lightning's Swift Strike"
**Warning signs:** 404s for specific spirits, broken image links

### Pitfall 3: Aspect Data Split Across Pages
**What goes wrong:** Aspect complexity modifier and expansion data is on different pages
**Why it happens:** Wiki has both "List of Aspect Cards" and individual spirit pages
**How to avoid:** Scrape aspect list page for metadata, spirit pages for mechanics
**Warning signs:** Missing complexityModifier values, wrong expansion assignments

### Pitfall 4: Opening Guides are User-Generated Content
**What goes wrong:** Attempting to auto-scrape opening guides results in inconsistent/outdated data
**Why it happens:** BGG threads and wiki strategy sections are free-form text, not structured data
**How to avoid:** Manually curate opening guides from authoritative sources (Jeremy Lennert threads, Spirit Island Hub)
**Warning signs:** Contradictory strategies, outdated references to old errata

### Pitfall 5: Reseed Deletes User Openings
**What goes wrong:** Running reseedSpirits wipes user-created openings
**Why it happens:** clearExistingData() deletes openings table
**How to avoid:** Either exclude openings from reseed, or backup/restore user openings
**Warning signs:** User-contributed content disappears after reseed

## Code Examples

Verified patterns from existing codebase:

### Scraping Spirit Page Data
```typescript
// Source: scripts/scrape-spirits.ts (existing)
const WIKI_BASE = "https://spiritislandwiki.com";

async function scrapeSpirit(slug: string, wikiTitle: string): Promise<ScrapedSpirit> {
  const url = `${WIKI_BASE}/index.php?title=${wikiTitle}`;
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  // Find complexity from infobox
  const complexity = $(".infobox").find("td:contains('Complexity')").next().text().trim();

  // Find power summary (offense/defense/etc bars)
  // Wiki uses Template:Powersummary with numeric values
  const powerSummary = $(".powersummary");
  // Parse bar widths or template data

  return { /* ... */ };
}
```

### Wiki Image URL Pattern
```typescript
// Source: spiritislandwiki.com structure analysis
// Full image URL pattern:
// https://spiritislandwiki.com/images/[letter]/[2letters]/[Filename].png

// Thumb URL pattern (avoid):
// https://spiritislandwiki.com/images/thumb/[letter]/[2letters]/[Filename].png/[width]px-[Filename].png

// To get full image from a page, look for srcset attribute without /thumb/
```

### Expansion Mapping
```typescript
// Source: convex/seed.ts (existing)
const EXPANSIONS = [
  { name: "Base Game", slug: "base-game", releaseYear: 2017 },
  { name: "Branch & Claw", slug: "branch-and-claw", releaseYear: 2017 },
  { name: "Jagged Earth", slug: "jagged-earth", releaseYear: 2020 },
  { name: "Feather and Flame", slug: "feather-and-flame", releaseYear: 2022 },
  { name: "Horizons of Spirit Island", slug: "horizons", releaseYear: 2022 },
  { name: "Nature Incarnate", slug: "nature-incarnate", releaseYear: 2023 },
  { name: "Promo Pack 2", slug: "promo-pack-2", releaseYear: 2021 },
] as const;
```

## Data Inventory

### Spirits to Scrape (37 total)

**Base Game (8):**
- Lightning's Swift Strike, River Surges in Sunlight, Shadows Flicker Like Flame, Vital Strength of the Earth
- A Spread of Rampant Green, Thunderspeaker, Bringer of Dreams and Nightmares, Ocean's Hungry Grasp

**Branch & Claw (2):**
- Keeper of the Forbidden Wilds, Sharp Fangs Behind the Leaves

**Jagged Earth (10):**
- Fractured Days Split the Sky, Starlight Seeks Its Form, Finder of Paths Unseen, Serpent Slumbering Beneath the Island
- Grinning Trickster Stirs Up Trouble, Lure of the Deep Wilderness, Many Minds Move as One, Shifting Memory of Ages
- Stone's Unyielding Defiance, Volcano Looming High, Shroud of Silent Mist, Vengeance as a Burning Plague

**Feather and Flame (4):**
- Heart of the Wildfire, Downpour Drenches the World (Promo Pack 1)
- Finder of Paths Unseen moved to Jagged Earth category per wiki

**Horizons (5):**
- Devouring Teeth Lurk Underfoot, Eyes Watch from the Trees, Fathomless Mud of the Swamp
- Rising Heat of Stone and Sand, Sun-Bright Whirlwind

**Nature Incarnate (8):**
- Ember-Eyed Behemoth, Hearth-Vigil, Towering Roots of the Jungle, Breath of Darkness Down Your Spine
- Relentless Gaze of the Sun, Wandering Voice Keens Delirium, Wounded Waters Bleeding, Dances Up Earthquakes

### Aspects to Scrape (31 total per wiki)

| Spirit | Aspects |
|--------|---------|
| Lightning's Swift Strike | Pandemonium, Wind, Immense, Sparking |
| River Surges in Sunlight | Sunshine, Travel, Haven |
| Shadows Flicker Like Flame | Madness, Reach, Amorphous, Foreboding, Dark Fire |
| Vital Strength of the Earth | Resilience, Might, Nourishing |
| A Spread of Rampant Green | Regrowth, Tangles |
| Bringer of Dreams and Nightmares | Enticing, Violence |
| Heart of the Wildfire | Transforming |
| Keeper of the Forbidden Wilds | Spreading Hostility |
| Lure of the Deep Wilderness | Lair |
| Ocean's Hungry Grasp | Deeps |
| Serpent Slumbering Beneath the Island | Locus |
| Sharp Fangs Behind the Leaves | Encircle, Unconstrained |
| Shifting Memory of Ages | Intensify, Mentor |
| Shroud of Silent Mist | Stranded |
| Thunderspeaker | Tactician, Warrior |

### Opening Guide Sources

**Authoritative Community Sources:**
1. **Jeremy Lennert's BGG Opening Threads** - Covers most base game + Branch & Claw spirits
   - Format: Detailed turn-by-turn with growth/presence decisions
   - Source: https://boardgamegeek.com/user/Antistone

2. **Spirit Island Hub** (latentoctopus.github.io)
   - Format: Categorized by track focus (top/bottom/hybrid) and power type (minor/major/mixed)
   - Covers most spirits with multiple opening variants

3. **Spirit Island Wiki Strategy Sections**
   - Format: Free-form text, variable quality
   - Good for general playstyle, less structured openings

**Recommendation:** Manually curate opening guides, prioritizing:
1. River (existing), Lightning (high priority - beginner spirit)
2. Base game spirits (most played)
3. Community-validated openings only

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| WebP image format | PNG format | Phase 2.1 | Simpler - no conversion needed |
| Automated opening scraping | Manual curation | This phase | Better quality, community-validated |
| Single seed script | Separate scrape + seed | This phase | Allows review before database changes |

**Deprecated/outdated:**
- Complex DSL for growth/presence/innates (Phase 3.4 abandoned) - now using text-based openings only

## Open Questions

Things that couldn't be fully resolved:

1. **Power Rating Numeric Values**
   - What we know: Wiki uses 5-level scale (low, med-low, medium, med-high, high)
   - What's unclear: Exact numeric mapping to project's 0-5 scale
   - Recommendation: Map as 1-5 (or use visual bar width percentages from wiki)

2. **Aspect Image Availability**
   - What we know: Some aspects have unique art, some don't
   - What's unclear: Complete list of which aspects have images
   - Recommendation: Scrape what exists, use base spirit image as fallback

3. **Opening Guide Licensing**
   - What we know: BGG content is user-generated, wiki is CC-BY-NC-SA
   - What's unclear: Can BGG opening guides be reproduced with attribution?
   - Recommendation: Link to sources, write derivative summaries rather than copying

## Sources

### Primary (HIGH confidence)
- Spirit Island Wiki - https://spiritislandwiki.com/index.php?title=Spirits (spirit list, data structure)
- Spirit Island Wiki - https://spiritislandwiki.com/index.php?title=List_of_Aspect_Cards (aspect list)
- Spirit Island Wiki - https://spiritislandwiki.com/index.php?title=Template:Spirit (template parameters)
- Existing codebase: `scripts/scrape-spirits.ts` (proven scraping pattern)
- Existing codebase: `convex/seed.ts` (seeding pattern)

### Secondary (MEDIUM confidence)
- BoardGameGeek Spirit Island Forums - https://boardgamegeek.com/boardgame/162886/spirit-island (opening guides, community strategies)
- Spirit Island Hub - https://latentoctopus.github.io/ (opening guide aggregator)
- Greater Than Games Forums - https://forums.greaterthangames.com/t/what-do-control-utility-really-mean/19211 (power rating definitions)

### Tertiary (LOW confidence)
- Wikipedia Spirit Island article (spirit count verification)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Already have working scraping code in codebase
- Architecture: HIGH - Extending existing patterns
- Data sources: HIGH - Wiki structure verified via WebFetch
- Pitfalls: MEDIUM - Based on wiki structure analysis and similar scraping projects

**Research date:** 2026-02-02
**Valid until:** 2026-03-02 (wiki structure stable, but new expansions may add spirits)
