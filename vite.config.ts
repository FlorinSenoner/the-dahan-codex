import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/",
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
  },
  plugins: [
    TanStackRouterVite({
      routesDirectory: "app/routes",
      generatedRouteTree: "app/routeTree.gen.ts",
    }),
    tailwindcss(),
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    viteReact(),
  ],
});
