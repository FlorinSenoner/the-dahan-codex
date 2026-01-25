/**
 * One-time script to scrape spirit images from Spirit Island wiki
 * Run with: npx tsx scripts/scrape-spirits.ts
 */

import * as fs from "node:fs";
import * as https from "node:https";
import * as path from "node:path";
import * as cheerio from "cheerio";

const WIKI_BASE = "https://spiritislandwiki.com";
const OUTPUT_DIR = "public/spirits";

// Spirits to download (slug -> wiki page title and image filename pattern)
const SPIRITS: Record<string, { wikiTitle: string; imagePattern: string }> = {
  "river-surges-in-sunlight": {
    wikiTitle: "River_Surges_in_Sunlight",
    imagePattern: "River_Surges_in_Sunlight",
  },
  "lightnings-swift-strike": {
    wikiTitle: "Lightning%27s_Swift_Strike",
    imagePattern: "Lightning%27s_Swift_Strike",
  },
};

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

    console.log(`  Full URL: ${fullUrl}`);

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

async function scrapeSpirit(
  slug: string,
  config: { wikiTitle: string; imagePattern: string },
): Promise<void> {
  const url = `${WIKI_BASE}/index.php?title=${config.wikiTitle}`;
  console.log(`Fetching ${url}...`);

  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  // Look for images that contain the spirit name in their alt or src
  let imgSrc: string | undefined;

  // Strategy 1: Find by alt text containing the spirit name (without .png)
  // The wiki uses alt text like "River Surges in Sunlight.png"
  $("img").each((_, el) => {
    if (imgSrc) return; // Already found

    const alt = $(el).attr("alt") || "";
    const src = $(el).attr("src") || "";
    const srcset = $(el).attr("srcset") || "";

    // Check if this is the spirit panel image (not icons, thumbnails, etc)
    const spiritName = config.imagePattern
      .replace(/_/g, " ")
      .replace(/%27/g, "'");
    if (alt.toLowerCase().includes(spiritName.toLowerCase())) {
      // Prefer the full-size image from srcset (e.g., "/images/f/ff/River_Surges_in_Sunlight.png 1.5x")
      if (srcset) {
        // Extract full-size URL from srcset (first entry without width specified)
        const srcsetParts = srcset.split(",").map((s) => s.trim());
        for (const part of srcsetParts) {
          const [srcUrl] = part.split(" ");
          // Skip thumb versions
          if (!srcUrl.includes("/thumb/")) {
            imgSrc = srcUrl;
            break;
          }
        }
      }
      // Fallback to src if we didn't find a full-size in srcset
      if (!imgSrc && src && !src.includes("/thumb/")) {
        imgSrc = src;
      }
      // Even thumb is better than nothing
      if (!imgSrc && src) {
        imgSrc = src;
      }
    }
  });

  // Strategy 2: Look for link to the full image file page
  if (!imgSrc) {
    $(`a[href*="File:${config.imagePattern}"]`).each((_, el) => {
      if (imgSrc) return;
      const img = $(el).find("img").first();
      const srcset = img.attr("srcset") || "";

      if (srcset) {
        const srcsetParts = srcset.split(",").map((s) => s.trim());
        for (const part of srcsetParts) {
          const [srcUrl] = part.split(" ");
          if (!srcUrl.includes("/thumb/")) {
            imgSrc = srcUrl;
            break;
          }
        }
      }
    });
  }

  if (!imgSrc) {
    console.error(`Could not find image for ${slug}`);
    console.log("Searched for pattern:", config.imagePattern);
    return;
  }

  // Download the image
  const ext = path.extname(imgSrc).split("?")[0] || ".png";
  const destPath = path.join(OUTPUT_DIR, `${slug}${ext}`);

  console.log(`Downloading ${imgSrc}`);
  console.log(`  -> ${destPath}`);

  await downloadImage(imgSrc, destPath);
  console.log(`  Saved: ${destPath}`);
}

async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const [slug, config] of Object.entries(SPIRITS)) {
    try {
      await scrapeSpirit(slug, config);
    } catch (error) {
      console.error(`Error scraping ${slug}:`, error);
    }
  }

  console.log("\nDone! Images saved to", OUTPUT_DIR);
  console.log(
    "Note: The seed data expects .webp format. You may need to convert or update imageUrl paths.",
  );
}

main();
