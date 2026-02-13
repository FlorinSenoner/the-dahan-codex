# The Dahan Codex

A Spirit Island companion app with an offline-first reference library and game tracker.

**Live at [dahan-codex.com](https://dahan-codex.com)**

## Features

- **Spirit Library** — Browse all 37 spirits and 31 aspects with filtering by expansion, complexity,
  and elements
- **Spirit Detail** — View complexity, power ratings radar chart, unique/special powers, and growth
  options
- **Opening Guides** — 85+ text-based turn-by-turn opening guides from community sources
- **Game Tracker** — Log plays with spirits, adversaries, scenarios, and scores (requires sign-in)
- **Offline-First PWA** — Installable, works without internet at the game table

## Tech Stack

- **Frontend**: React 19, TanStack Router (file-based routing), TanStack Query
- **Backend**: Convex (real-time database + serverless functions)
- **Auth**: Clerk
- **Styling**: Tailwind CSS 4, Radix UI primitives, shadcn/ui
- **PWA**: vite-plugin-pwa + Workbox (injectManifest strategy)
- **Deployment**: Cloudflare Pages
- **Tooling**: Vite 7, Biome (lint/format), Playwright (E2E tests), pnpm

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v22+
- [pnpm](https://pnpm.io/) v10+
- [mise](https://mise.jdx.dev/) (optional — manages Node/pnpm versions)

### Installation

```bash
# Clone the repository
git clone https://github.com/FlorinSenoner/the-dahan-codex.git
cd the-dahan-codex

# Install dependencies
pnpm install
```

### Environment Variables

Create a `mise.local.toml` (if using mise) or `.env.local` with:

```
VITE_CONVEX_URL=https://<your-deployment>.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

You'll need a [Convex](https://convex.dev) project and a [Clerk](https://clerk.com) application.

### Development

```bash
# Start dev server (port 4127)
pnpm dev

# In another terminal, start Convex dev server
npx convex dev
```

### Build & Test

```bash
pnpm build        # Production build
pnpm preview      # Preview production build locally
pnpm test:e2e     # Run Playwright E2E tests
pnpm ci           # Full CI: lint, typecheck, build, test
```

## Project Structure

```
the-dahan-codex/
├── src/
│   ├── routes/           # TanStack Router file-based routes
│   ├── components/       # React components (ui/, spirits/, games/, pwa/, admin/)
│   ├── hooks/            # Custom hooks (PWA, online status, admin)
│   ├── lib/              # Shared utilities
│   ├── contexts/         # React contexts
│   ├── router.tsx        # Router configuration
│   └── sw.ts             # Service worker source
├── convex/               # Backend functions and schema
│   ├── schema.ts         # Database schema (source of truth)
│   ├── spirits.ts        # Spirit queries
│   ├── games.ts          # Game tracker CRUD
│   ├── openings.ts       # Opening guides queries/mutations
│   └── seedData/         # Seed data for spirits, aspects, openings
├── e2e/                  # Playwright E2E tests
├── public/               # Static assets (spirit images, card images)
├── scripts/              # Data scraping scripts
└── .planning/            # Project planning docs
```

## Scripts

| Command          | Description                   |
| ---------------- | ----------------------------- |
| `pnpm dev`       | Start development server      |
| `pnpm build`     | Build for production          |
| `pnpm preview`   | Preview production build      |
| `pnpm lint:fix`  | Fix linting issues with Biome |
| `pnpm typecheck` | Run TypeScript type checking  |
| `pnpm test:e2e`  | Run Playwright E2E tests      |
| `pnpm ci`        | Run full CI pipeline locally  |

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure `pnpm ci` passes (lint, typecheck, build, tests)
4. Submit a pull request

Pre-commit hooks run Biome checks and TypeScript type checking automatically.

## Disclaimer

The Dahan Codex is an unofficial fan project and is not affiliated with Greater Than Games, LLC.
Spirit Island and all related materials, names, and images are the property of Greater Than Games,
LLC.

## License

This project is licensed under the [MIT License](LICENSE). Spirit Island and all related game
content belong to Greater Than Games, LLC.
