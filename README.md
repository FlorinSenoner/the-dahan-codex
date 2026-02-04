# The Dahan Codex

A companion app for the board game Spirit Island, designed for the community.

## Core Value

**The Opening Scrubber** — a graphical, scrubbable visualization of spirit openings that re-creates
the spirit board mechanics in code. Users scrub through turns on a timeline and see the exact board
state at each turn: growth options with the chosen one highlighted, presence tracks updating slot by
slot, and cards played with full previews.

## Features

- **Spirits Library** — Browse all spirits with filtering by expansion and complexity
- **Spirit Detail** — View complexity, strengths/weaknesses, power ratings radar chart
- **Opening Scrubber** — Turn-by-turn graphical visualization of spirit openings
- **Game Tracker** — Track plays with spirits, adversaries, scenarios, and scores (logged-in users)
- **Notes** — Rich-text notes with backlinks attachable to spirits, openings, or games
- **PWA** — Installable, offline-capable progressive web app

## Tech Stack

- **Frontend**: TanStack Start (React 19 + TypeScript), TanStack Router/Query
- **Backend**: Convex (real-time database)
- **Auth**: Clerk
- **Styling**: Tailwind CSS, Radix/Ark primitives
- **PWA**: Workbox service worker
- **Deployment**: Cloudflare Workers
- **Tooling**: Biome (lint/format), Playwright (E2E tests), pnpm

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v22+
- [pnpm](https://pnpm.io/) v10+
- [mise](https://mise.jdx.dev/) (optional, for toolchain management)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/the-dahan-codex.git
cd the-dahan-codex

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Convex and Clerk credentials
```

### Development

```bash
# Start dev server (port 4127)
pnpm dev

# In another terminal, start Convex dev server
npx convex dev
```

### Build & Preview

```bash
# Build for production
pnpm build

# Preview locally with Wrangler
pnpm preview
```

## Project Structure

```
the-dahan-codex/
├── app/                  # Frontend application
│   ├── routes/           # TanStack Router file-based routes
│   ├── lib/              # Shared utilities
│   ├── client.tsx        # Client entry point
│   ├── server.tsx        # Server entry point
│   └── router.tsx        # Router configuration
├── convex/               # Convex backend
│   ├── schema.ts         # Database schema
│   ├── health.ts         # Health check query
│   └── _generated/       # Auto-generated types
├── e2e/                  # Playwright E2E tests
├── public/               # Static assets (icons, manifest)
├── scripts/              # Build scripts (SW generation)
└── .planning/            # Project planning docs
```

## Scripts

| Command          | Description                            |
| ---------------- | -------------------------------------- |
| `pnpm dev`       | Start development server               |
| `pnpm build`     | Build for production                   |
| `pnpm preview`   | Preview production build with Wrangler |
| `pnpm deploy`    | Deploy to Cloudflare Workers           |
| `pnpm lint`      | Run Biome linting                      |
| `pnpm lint:fix`  | Fix linting issues                     |
| `pnpm format`    | Format code with Biome + Prettier      |
| `pnpm typecheck` | Run TypeScript type checking           |
| `pnpm test:e2e`  | Run Playwright E2E tests               |
| `pnpm ci`        | Run full CI pipeline locally           |

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure `pnpm ci` passes (lint, typecheck, build, tests)
4. Submit a pull request

Pre-commit hooks run Biome checks automatically.

## Disclaimer

The Dahan Codex is an unofficial fan project and is not affiliated with Greater Than Games, LLC.
Spirit Island and all related materials, names, and images are the property of Greater Than Games,
LLC.

## License

This project is for personal/educational use. Spirit Island content belongs to Greater Than Games,
LLC.
