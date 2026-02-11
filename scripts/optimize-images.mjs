/**
 * Convert spirit PNGs to WebP for smaller precache size.
 * Keeps original PNGs in place; generates .webp siblings at quality 80.
 *
 * Run: node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import { readdirSync, statSync } from "fs";
import { resolve, dirname, extname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const spiritsDir = resolve(__dirname, "../public/spirits");

const files = readdirSync(spiritsDir).filter((f) => extname(f) === ".png");
console.log(`Found ${files.length} PNGs to convert`);

let totalOriginal = 0;
let totalConverted = 0;

for (const file of files) {
  const inputPath = resolve(spiritsDir, file);
  const outputPath = resolve(spiritsDir, `${basename(file, ".png")}.webp`);

  const originalSize = statSync(inputPath).size;
  totalOriginal += originalSize;

  const { size } = await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);
  totalConverted += size;
}

console.log(
  `Converted ${files.length} images: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB → ${(totalConverted / 1024 / 1024).toFixed(1)}MB`
);
