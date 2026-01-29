import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { generateSW } from "workbox-build";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

async function buildServiceWorker() {
  const outputDir = join(rootDir, "dist");

  // Ensure output directory exists
  if (!existsSync(outputDir)) {
    console.log("Output directory does not exist, creating...");
    mkdirSync(outputDir, { recursive: true });
  }

  console.log("Generating service worker...");

  try {
    const { count, size, warnings } = await generateSW({
      swDest: join(outputDir, "sw.js"),
      globDirectory: outputDir,
      globPatterns: ["**/*.{js,css,html,png,svg,ico,webp,woff,woff2,json}"],
      globIgnores: ["**/node_modules/**", "sw.js", "workbox-*.js"],
      // Add leading slash to all URLs for consistency with navigateFallback
      modifyURLPrefix: {
        "": "/",
      },
      // IMPORTANT: skipWaiting false to prevent broken state during updates
      skipWaiting: false,
      clientsClaim: false,
      // SPA navigation fallback - serve index.html for all navigation requests
      navigateFallback: "/index.html",
      // Exclude API calls and files with extensions from fallback
      navigateFallbackDenylist: [/^\/api\//, /\.[^/]+$/],
      // Runtime caching rules
      // Note: Convex data is cached via TanStack Query persistence to IndexedDB,
      // not via service worker (Convex uses WebSockets, not HTTP)
      runtimeCaching: [],
    });

    console.log("Generated service worker");
    console.log(`  Precached ${count} files (${(size / 1024).toFixed(1)} KB)`);

    if (warnings.length > 0) {
      console.log("Warnings:");
      for (const warning of warnings) {
        console.log(`  - ${warning}`);
      }
    }
  } catch (error) {
    console.error("Failed to generate service worker:", error);
    process.exit(1);
  }
}

buildServiceWorker();
