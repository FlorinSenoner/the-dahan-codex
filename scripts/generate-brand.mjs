/**
 * Generate all brand assets for The Dahan Codex.
 * Constellation design: seven spirit element dots in a heptagonal pattern.
 *
 * Run: pnpm add -D sharp && node scripts/generate-brand.mjs
 *
 * Outputs:
 *   public/favicon.svg                 SVG with prefers-color-scheme dark mode
 *   public/favicon-48.png              48×48 PNG fallback
 *   public/apple-touch-icon.png        180×180 iOS home screen
 *   public/icons/icon-192.png          192×192 PWA icon
 *   public/icons/icon-512.png          512×512 PWA icon
 *   public/icons/icon-maskable-512.png 512×512 maskable (safe zone)
 *   public/og-image.png                1200×630 OpenGraph image
 */
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC = resolve(ROOT, "public");

mkdirSync(resolve(PUBLIC, "icons"), { recursive: true });

// ── Spirit Element Colors ──────────────────────────
const EL = [
  "#E8C840", // sun
  "#D07030", // fire
  "#9878C0", // air
  "#4080B8", // water
  "#38884C", // plant
  "#B0B0C0", // moon
  "#888078", // earth
];

// ── Theme Colors ───────────────────────────────────
const BG = "#1a1108";
const BG_LIGHT = "#E8DCC8";
const GOLD = "#C8A060";
const GOLD_DK = "#8B6914";
const CREAM = "#E8DCC8";
const MUTED = "#907858";

// ── Geometry ───────────────────────────────────────
function heptPts(cx, cy, r) {
  return Array.from({ length: 7 }, (_, i) => {
    const a = (i * 2 * Math.PI) / 7 - Math.PI / 2;
    return [
      +(cx + r * Math.cos(a)).toFixed(1),
      +(cy + r * Math.sin(a)).toFixed(1),
    ];
  });
}

// ── Constellation building blocks ──────────────────
function lines(pts, color, sw1 = 1.5, sw2 = 0.8) {
  const out = [];
  for (let i = 0; i < 7; i++) {
    const j = (i + 1) % 7;
    out.push(
      `<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[j][0]}" y2="${pts[j][1]}" stroke="${color}" stroke-width="${sw1}" opacity="0.25"/>`,
    );
  }
  for (let i = 0; i < 7; i++) {
    const j = (i + 2) % 7;
    out.push(
      `<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[j][0]}" y2="${pts[j][1]}" stroke="${color}" stroke-width="${sw2}" opacity="0.12"/>`,
    );
  }
  return out.join("\n  ");
}

function dots(pts, glowR = 22, coreR = 14) {
  return pts
    .map(
      (p, i) =>
        `<circle cx="${p[0]}" cy="${p[1]}" r="${glowR}" fill="${EL[i]}" opacity="0.12"/>` +
        `<circle cx="${p[0]}" cy="${p[1]}" r="${coreR}" fill="${EL[i]}" opacity="0.85"/>`,
    )
    .join("\n  ");
}

// ── SVG Generators ─────────────────────────────────

/** Light-mode-only SVG for rasterizing to PNG. */
function pngSvg(rounded = true) {
  const pts = heptPts(256, 256, 120);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${rounded ? 96 : 0}" fill="${BG}"/>
  ${lines(pts, GOLD)}
  ${dots(pts)}
  <circle cx="256" cy="256" r="3" fill="${GOLD}" opacity="0.5"/>
</svg>`;
}

/** SVG favicon with CSS prefers-color-scheme dark mode. */
function svgFavicon() {
  const pts = heptPts(256, 256, 120);
  // Lines use CSS class so stroke color switches with theme
  const ln = [];
  for (let i = 0; i < 7; i++) {
    const j = (i + 1) % 7;
    ln.push(
      `<line class="l" x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[j][0]}" y2="${pts[j][1]}" stroke-width="1.5" opacity="0.25"/>`,
    );
  }
  for (let i = 0; i < 7; i++) {
    const j = (i + 2) % 7;
    ln.push(
      `<line class="l" x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[j][0]}" y2="${pts[j][1]}" stroke-width="0.8" opacity="0.12"/>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
<style>
  .b{fill:${BG}} .l{stroke:${GOLD}} .c{fill:${GOLD}}
  @media(prefers-color-scheme:dark){
    .b{fill:${BG_LIGHT}} .l{stroke:${GOLD_DK}} .c{fill:${GOLD_DK}}
  }
</style>
<rect class="b" width="512" height="512" rx="96"/>
${ln.join("\n")}
${dots(pts)}
<circle class="c" cx="256" cy="256" r="3" opacity="0.5"/>
</svg>`;
}

/** OG image 1200×630. */
function ogSvg(fontBase64) {
  const pts = heptPts(0, 0, 150);
  const ff = fontBase64
    ? `@font-face{font-family:'Fraunces';src:url(data:font/woff2;base64,${fontBase64}) format('woff2');font-weight:700;font-style:italic}`
    : "";
  const font = fontBase64
    ? "'Fraunces',Georgia,serif"
    : "Georgia,'Times New Roman',serif";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <style>${ff}</style>
  <rect width="1200" height="630" fill="${BG}"/>
  <rect x="20" y="20" width="1160" height="590" rx="8" fill="none" stroke="${GOLD}" stroke-width="0.5" opacity="0.2"/>
  <g transform="translate(280,315) scale(0.8)">
    ${lines(pts, GOLD)}
    ${dots(pts)}
    <circle cx="0" cy="0" r="3" fill="${GOLD}" opacity="0.5"/>
  </g>
  <text x="780" y="260" text-anchor="middle" font-family="${font}" font-size="60" font-weight="700" font-style="italic" fill="${CREAM}">The Dahan Codex</text>
  <text x="780" y="320" text-anchor="middle" font-family="${font}" font-size="24" font-style="italic" fill="${MUTED}">A Spirit Island Companion</text>
  <line x1="680" y1="350" x2="880" y2="350" stroke="${GOLD}" stroke-width="0.8" opacity="0.3"/>
  <text x="780" y="390" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="${MUTED}" opacity="0.8">Browse spirits · Follow openings · Track games</text>
  <text x="780" y="425" text-anchor="middle" font-family="system-ui,sans-serif" font-size="15" fill="${MUTED}" opacity="0.5">dahan-codex.com</text>
</svg>`;
}

// ── Font download ──────────────────────────────────
async function fetchFraunces() {
  const res = await fetch(
    "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,700&display=swap",
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    },
  );
  const css = await res.text();
  const m = css.match(/url\(([^)]+\.woff2[^)]*)\)/);
  if (!m) throw new Error("woff2 URL not found in Google Fonts CSS");
  const fontRes = await fetch(m[1]);
  return Buffer.from(await fontRes.arrayBuffer()).toString("base64");
}

// ── Main ───────────────────────────────────────────
async function main() {
  console.log("Generating brand assets…\n");

  // 1. SVG favicon (with dark mode)
  writeFileSync(resolve(PUBLIC, "favicon.svg"), svgFavicon());
  console.log("  ✓ favicon.svg");

  // 2–6. PNG raster assets
  const rounded = Buffer.from(pngSvg(true));
  const square = Buffer.from(pngSvg(false));

  await Promise.all([
    sharp(rounded)
      .resize(48, 48)
      .png()
      .toFile(resolve(PUBLIC, "favicon-48.png")),
    sharp(square)
      .resize(180, 180)
      .png()
      .toFile(resolve(PUBLIC, "apple-touch-icon.png")),
    sharp(rounded)
      .resize(192, 192)
      .png()
      .toFile(resolve(PUBLIC, "icons", "icon-192.png")),
    sharp(rounded).png().toFile(resolve(PUBLIC, "icons", "icon-512.png")),
    sharp(square)
      .png()
      .toFile(resolve(PUBLIC, "icons", "icon-maskable-512.png")),
  ]);
  console.log("  ✓ favicon-48.png (48×48)");
  console.log("  ✓ apple-touch-icon.png (180×180)");
  console.log("  ✓ icons/icon-192.png (192×192)");
  console.log("  ✓ icons/icon-512.png (512×512)");
  console.log("  ✓ icons/icon-maskable-512.png (512×512, maskable)");

  // 7. OG image (with Fraunces font if available)
  let fontB64 = null;
  try {
    fontB64 = await fetchFraunces();
    console.log("  ✓ Downloaded Fraunces italic 700");
  } catch (e) {
    console.warn(
      `  ⚠ Could not download Fraunces, using fallback serif: ${e.message}`,
    );
  }
  await sharp(Buffer.from(ogSvg(fontB64)))
    .png()
    .toFile(resolve(PUBLIC, "og-image.png"));
  console.log("  ✓ og-image.png (1200×630)");

  console.log("\nDone! 7 assets generated.");
}

main().catch(console.error);
