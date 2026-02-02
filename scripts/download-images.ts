/**
 * Script to download spirit and aspect images from Spirit Island wiki
 * Run with: npx tsx scripts/download-images.ts
 * Spirits only: npx tsx scripts/download-images.ts --spirits-only
 * Aspects only: npx tsx scripts/download-images.ts --aspects-only
 */

import * as fs from "node:fs";
import * as https from "node:https";
import * as path from "node:path";
import * as cheerio from "cheerio";

const WIKI_BASE = "https://spiritislandwiki.com";
const OUTPUT_DIR = "public/spirits";
const DATA_DIR = "scripts/data";

// Rate limiting delay between downloads (ms)
const RATE_LIMIT_DELAY = 500;

// Minimum file size to consider valid (100KB)
const MIN_FILE_SIZE = 100 * 1024;

interface Spirit {
  name: string;
  slug: string;
  wikiUrl: string;
  imagePattern: string;
}

interface Aspect {
  name: string;
  slug: string;
  baseSpiritSlug: string;
  wikiUrl: string;
  imagePattern: string;
  hasUniqueImage: boolean;
}

interface DownloadStats {
  downloaded: number;
  skipped: number;
  errors: string[];
  noUniqueArt: string[];
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        // Handle redirects
        if (res.statusCode === 301 || res.statusCode === 302) {
          const redirectUrl = res.headers.location;
          if (redirectUrl) {
            fetchPage(
              redirectUrl.startsWith("http")
                ? redirectUrl
                : `${WIKI_BASE}${redirectUrl}`,
            )
              .then(resolve)
              .catch(reject);
            return;
          }
        }
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => resolve(data));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function downloadImage(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Build full URL - handle relative paths
    let fullUrl: string;
    if (url.startsWith("http")) {
      fullUrl = url;
    } else if (url.startsWith("//")) {
      fullUrl = `https:${url}`;
    } else if (url.startsWith("/")) {
      fullUrl = `${WIKI_BASE}${url}`;
    } else {
      fullUrl = `${WIKI_BASE}/${url}`;
    }

    https
      .get(fullUrl, (res) => {
        // Handle redirects
        if (res.statusCode === 301 || res.statusCode === 302) {
          const redirectUrl = res.headers.location;
          if (redirectUrl) {
            downloadImage(redirectUrl, dest).then(resolve).catch(reject);
            return;
          }
        }

        // Check for errors
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${fullUrl}`));
          return;
        }

        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
        file.on("error", (err) => {
          fs.unlink(dest, () => {}); // Delete partial file
          reject(err);
        });
      })
      .on("error", reject);
  });
}

function findSpiritImageUrl(
  $: cheerio.CheerioAPI,
  spiritName: string,
): string | null {
  // Strategy: Look for img with alt text matching the spirit name pattern
  // We want the full-res PNG version, not thumbnail or SVG
  let imageUrl: string | null = null;

  // Normalize the spirit name for matching - keep hyphens as underscores
  const normalizedName = spiritName
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[\s-]/g, "_")
    .replace(/_+/g, "_");

  $("img").each((_, el) => {
    const alt = $(el).attr("alt") || "";
    const src = $(el).attr("src") || "";
    const srcset = $(el).attr("srcset") || "";

    // Skip non-PNG images (SVGs, etc.)
    if (!src.toLowerCase().includes(".png")) {
      return; // Continue to next image
    }

    // Skip small icons (like element icons, presence icons, etc.)
    const width = parseInt($(el).attr("width") || "0", 10);
    if (width > 0 && width < 200) {
      return; // Continue to next image
    }

    // Check if this is a spirit panel image by looking for the spirit name in alt
    // Alt text is typically "Spirit_Name.png" or "Spirit Name.png"
    const normalizedAlt = alt
      .toLowerCase()
      .replace(/'/g, "")
      .replace(/[\s-]/g, "_")
      .replace(/_+/g, "_");

    // Check for exact match on alt text (e.g., "a_spread_of_rampant_green.png")
    const isExactMatch =
      normalizedAlt === `${normalizedName}.png` ||
      normalizedAlt === normalizedName ||
      normalizedAlt.includes(normalizedName);

    // Also check src path for the spirit name
    const normalizedSrc = src
      .toLowerCase()
      .replace(/%27/g, "")
      .replace(/'/g, "")
      .replace(/[\s-]/g, "_");
    const hasSrcMatch = normalizedSrc.includes(normalizedName);

    if (isExactMatch || hasSrcMatch) {
      // Prefer srcset for higher resolution - srcset format: "url 1.5x, url2 2x"
      if (srcset) {
        const srcsetParts = srcset.split(",");
        for (const part of srcsetParts) {
          const url = part.trim().split(" ")[0];
          // Skip thumbnail URLs (contain /thumb/) and non-PNG
          if (!url.includes("/thumb/") && url.toLowerCase().includes(".png")) {
            imageUrl = url;
            return false; // Break the loop
          }
        }
      }

      // If srcset didn't have non-thumb URL, extract from thumb URL
      if (!imageUrl && src.includes("/thumb/")) {
        // Convert /images/thumb/a/ab/Image.png/600px-Image.png to /images/a/ab/Image.png
        const thumbMatch = src.match(
          /\/images\/thumb(\/[a-f0-9]\/[a-f0-9]{2}\/[^/]+\.png)/i,
        );
        if (thumbMatch) {
          imageUrl = `/images${thumbMatch[1]}`;
          return false;
        }
      }

      // Fallback to src if it's already full res
      if (!imageUrl && src && !src.includes("/thumb/")) {
        imageUrl = src;
        return false;
      }
    }
  });

  return imageUrl;
}

function findAspectImageUrl(
  $: cheerio.CheerioAPI,
  _aspectName: string,
  imagePattern: string,
): string | null {
  let imageUrl: string | null = null;

  // Normalize the image pattern for matching
  const normalizedPattern = imagePattern
    .replace(".png", "")
    .replace(/ /g, "_")
    .toLowerCase();

  // First try to find by image pattern
  $("img").each((_, el) => {
    const src = $(el).attr("src") || "";
    const srcset = $(el).attr("srcset") || "";
    const alt = $(el).attr("alt") || "";

    const normalizedSrc = src
      .toLowerCase()
      .replace(/%27/g, "'")
      .replace(/['\s]/g, "_");
    const normalizedAlt = alt
      .toLowerCase()
      .replace(/%27/g, "'")
      .replace(/['\s]/g, "_");

    // Check if src or alt contains the image pattern
    if (
      normalizedSrc.includes(normalizedPattern) ||
      normalizedAlt.includes(normalizedPattern)
    ) {
      // Skip small icons
      const width = parseInt($(el).attr("width") || "0", 10);
      if (width > 0 && width < 100) {
        return; // Continue to next image
      }

      // Prefer srcset for higher resolution
      if (srcset) {
        const srcsetParts = srcset.split(",");
        for (const part of srcsetParts) {
          const url = part.trim().split(" ")[0];
          if (!url.includes("/thumb/")) {
            imageUrl = url;
            return false;
          }
        }
      }

      // Try to extract full URL from thumb URL
      if (!imageUrl && src.includes("/thumb/")) {
        const thumbMatch = src.match(
          /\/images\/thumb(\/[a-f0-9]\/[a-f0-9]{2}\/[^/]+\.png)/i,
        );
        if (thumbMatch) {
          imageUrl = `/images${thumbMatch[1]}`;
          return false;
        }
      }

      if (!imageUrl && !src.includes("/thumb/")) {
        imageUrl = src;
        return false;
      }
    }
  });

  return imageUrl;
}

async function downloadSpiritImage(
  spirit: Spirit,
  stats: DownloadStats,
  force: boolean,
): Promise<void> {
  const destPath = path.join(OUTPUT_DIR, `${spirit.slug}.png`);

  // Skip if already exists and not forcing
  if (!force && fs.existsSync(destPath)) {
    const fileStats = fs.statSync(destPath);
    if (fileStats.size >= MIN_FILE_SIZE) {
      console.log(`Skipping ${spirit.name} (exists)`);
      stats.skipped++;
      return;
    }
    // File exists but is too small - re-download
    console.log(`Re-downloading ${spirit.name} (file too small)`);
  }

  process.stdout.write(`Downloading ${spirit.name}... `);

  try {
    // Fetch the wiki page to find the image URL
    const html = await fetchPage(spirit.wikiUrl);
    const $ = cheerio.load(html);

    const imageUrl = findSpiritImageUrl($, spirit.name);
    if (!imageUrl) {
      throw new Error("Could not find image URL on wiki page");
    }

    await downloadImage(imageUrl, destPath);

    // Verify file size
    const fileStats = fs.statSync(destPath);
    if (fileStats.size < MIN_FILE_SIZE) {
      fs.unlinkSync(destPath);
      throw new Error(`Downloaded file too small (${fileStats.size} bytes)`);
    }

    console.log("done");
    stats.downloaded++;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.log(`ERROR: ${errMsg}`);
    stats.errors.push(`${spirit.name}: ${errMsg}`);
  }
}

async function downloadAspectImage(
  aspect: Aspect,
  stats: DownloadStats,
  force: boolean,
): Promise<void> {
  // Skip aspects without unique images
  if (!aspect.hasUniqueImage) {
    console.log(`Skipping ${aspect.name} (uses base spirit image)`);
    stats.noUniqueArt.push(aspect.name);
    return;
  }

  const destPath = path.join(OUTPUT_DIR, `${aspect.slug}.png`);

  // Skip if already exists and not forcing
  if (!force && fs.existsSync(destPath)) {
    const fileStats = fs.statSync(destPath);
    if (fileStats.size >= MIN_FILE_SIZE) {
      console.log(`Skipping ${aspect.name} aspect (exists)`);
      stats.skipped++;
      return;
    }
    console.log(`Re-downloading ${aspect.name} aspect (file too small)`);
  }

  process.stdout.write(`Downloading ${aspect.name} aspect... `);

  try {
    // Fetch the wiki page to find the image URL
    const html = await fetchPage(aspect.wikiUrl);
    const $ = cheerio.load(html);

    const imageUrl = findAspectImageUrl($, aspect.name, aspect.imagePattern);
    if (!imageUrl) {
      throw new Error("Could not find aspect image URL on wiki page");
    }

    await downloadImage(imageUrl, destPath);

    // Verify file size
    const fileStats = fs.statSync(destPath);
    if (fileStats.size < MIN_FILE_SIZE) {
      fs.unlinkSync(destPath);
      throw new Error(`Downloaded file too small (${fileStats.size} bytes)`);
    }

    console.log("done");
    stats.downloaded++;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.log(`ERROR: ${errMsg}`);
    stats.errors.push(`${aspect.name} aspect: ${errMsg}`);
  }
}

async function downloadAllSpirits(
  spirits: Spirit[],
  stats: DownloadStats,
  force: boolean,
): Promise<void> {
  console.log(`\n=== Downloading ${spirits.length} Spirit Images ===\n`);

  for (const spirit of spirits) {
    await downloadSpiritImage(spirit, stats, force);
    await delay(RATE_LIMIT_DELAY);
  }
}

async function downloadAllAspects(
  aspects: Aspect[],
  stats: DownloadStats,
  force: boolean,
): Promise<void> {
  console.log(`\n=== Downloading Aspect Images ===\n`);

  const aspectsWithUniqueArt = aspects.filter((a) => a.hasUniqueImage);
  console.log(
    `${aspectsWithUniqueArt.length} aspects have unique art, ${
      aspects.length - aspectsWithUniqueArt.length
    } use base spirit image\n`,
  );

  for (const aspect of aspects) {
    await downloadAspectImage(aspect, stats, force);
    if (aspect.hasUniqueImage) {
      await delay(RATE_LIMIT_DELAY);
    }
  }
}

function printSummary(stats: DownloadStats): void {
  console.log("\n=== Summary ===");
  console.log(`Downloaded: ${stats.downloaded}`);
  console.log(`Skipped (already exist): ${stats.skipped}`);
  console.log(`Using base spirit fallback: ${stats.noUniqueArt.length}`);
  console.log(`Errors: ${stats.errors.length}`);

  if (stats.errors.length > 0) {
    console.log("\n=== Errors ===");
    for (const error of stats.errors) {
      console.log(`  - ${error}`);
    }
  }

  if (stats.noUniqueArt.length > 0) {
    console.log("\n=== Aspects Using Base Spirit Fallback ===");
    for (const name of stats.noUniqueArt) {
      console.log(`  - ${name}`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const spiritsOnly = args.includes("--spirits-only");
  const aspectsOnly = args.includes("--aspects-only");
  const force = args.includes("--force");

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load data
  const spiritsPath = path.join(DATA_DIR, "spirits.json");
  const aspectsPath = path.join(DATA_DIR, "aspects.json");

  if (!fs.existsSync(spiritsPath)) {
    console.error(
      `Error: ${spiritsPath} not found. Run scrape-spirits.ts first.`,
    );
    process.exit(1);
  }

  const spirits: Spirit[] = JSON.parse(fs.readFileSync(spiritsPath, "utf-8"));
  const aspects: Aspect[] = fs.existsSync(aspectsPath)
    ? JSON.parse(fs.readFileSync(aspectsPath, "utf-8"))
    : [];

  const stats: DownloadStats = {
    downloaded: 0,
    skipped: 0,
    errors: [],
    noUniqueArt: [],
  };

  if (!aspectsOnly) {
    await downloadAllSpirits(spirits, stats, force);
  }

  if (!spiritsOnly && aspects.length > 0) {
    await downloadAllAspects(aspects, stats, force);
  }

  printSummary(stats);

  // Exit with error code if there were errors
  if (stats.errors.length > 0) {
    process.exit(1);
  }
}

main();
