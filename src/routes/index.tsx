import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen, Compass, Gamepad2, WifiOff } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const spirits = [
  {
    name: "Lightning's Swift Strike",
    slug: 'lightnings-swift-strike',
    image: '/spirits/lightnings-swift-strike.png',
    complexity: 'Low',
    elements: ['Fire', 'Air'],
  },
  {
    name: 'River Surges in Sunlight',
    slug: 'river-surges-in-sunlight',
    image: '/spirits/river-surges-in-sunlight.png',
    complexity: 'Low',
    elements: ['Sun', 'Water'],
  },
  {
    name: 'Vital Strength of the Earth',
    slug: 'vital-strength-of-the-earth',
    image: '/spirits/vital-strength-of-the-earth.png',
    complexity: 'Low',
    elements: ['Earth', 'Plant'],
  },
  {
    name: 'Shadows Flicker Like Flame',
    slug: 'shadows-flicker-like-flame',
    image: '/spirits/shadows-flicker-like-flame.png',
    complexity: 'Low',
    elements: ['Moon', 'Fire', 'Air'],
  },
  {
    name: 'Thunderspeaker',
    slug: 'thunderspeaker',
    image: '/spirits/thunderspeaker.png',
    complexity: 'Moderate',
    elements: ['Sun', 'Air'],
  },
  {
    name: 'A Spread of Rampant Green',
    slug: 'a-spread-of-rampant-green',
    image: '/spirits/a-spread-of-rampant-green.png',
    complexity: 'Moderate',
    elements: ['Plant', 'Water'],
  },
  {
    name: "Ocean's Hungry Grasp",
    slug: 'oceans-hungry-grasp',
    image: '/spirits/oceans-hungry-grasp.png',
    complexity: 'High',
    elements: ['Water', 'Moon', 'Earth'],
  },
  {
    name: 'Bringer of Dreams and Nightmares',
    slug: 'bringer-of-dreams-and-nightmares',
    image: '/spirits/bringer-of-dreams-and-nightmares.png',
    complexity: 'High',
    elements: ['Moon', 'Air'],
  },
]

const features = [
  {
    icon: BookOpen,
    title: 'Spirit Library',
    description: 'Complete reference for all spirits, aspects, and power cards',
  },
  {
    icon: Gamepad2,
    title: 'Game Tracker',
    description: 'Log your games and track win rates across spirits',
  },
  {
    icon: Compass,
    title: 'Opening Guides',
    description: 'Turn-by-turn opening strategies for every spirit',
  },
  {
    icon: WifiOff,
    title: 'Offline Ready',
    description: 'Works without internet at your game table',
  },
]

const romanNumerals = ['I', 'II', 'III', 'IV']

const elementColors: Record<string, string> = {
  Fire: 'var(--element-fire)',
  Air: 'var(--element-air)',
  Sun: 'var(--element-sun)',
  Water: 'var(--element-water)',
  Earth: 'var(--element-earth)',
  Plant: 'var(--element-plant)',
  Moon: 'var(--element-moon)',
}

function OrnamentDivider() {
  return (
    <div className="flex items-center justify-center py-8 gap-4">
      <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-accent" />
      <svg aria-hidden="true" className="text-accent" height="24" viewBox="0 0 24 24" width="24">
        <path
          d="M12 2L14 8L12 6L10 8L12 2Z M12 22L10 16L12 18L14 16L12 22Z M2 12L8 10L6 12L8 14L2 12Z M22 12L16 14L18 12L16 10L22 12Z"
          fill="currentColor"
        />
      </svg>
      <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-accent" />
    </div>
  )
}

function HomePage() {
  return (
    <div className="min-h-screen pb-20 bg-background text-foreground">
      <div className="max-w-[900px] mx-auto px-6 pt-12 md:pt-20">
        {/* Hero Section */}
        <header className="text-center mb-4">
          <div className="flex items-start justify-center mb-6">
            <span
              className="font-headline leading-none mr-1 md:mr-2 select-none bg-gradient-to-br from-accent to-accent/70 bg-clip-text"
              style={{
                fontSize: 'clamp(6rem, 15vw, 8rem)',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(2px 3px 4px oklch(0.3 0.05 50 / 0.3))',
                fontWeight: 800,
                fontStyle: 'italic',
              }}
            >
              T
            </span>
            <span
              className="font-headline italic pt-6 md:pt-8 text-foreground"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                letterSpacing: '0.04em',
                fontWeight: 600,
              }}
            >
              he Dahan Codex
            </span>
          </div>
          <p className="font-headline italic text-lg md:text-xl tracking-wide text-muted-foreground">
            A Spirit Island Companion
          </p>
        </header>

        <OrnamentDivider />

        {/* Chapters Section */}
        <section className="mb-4">
          <h2
            className="text-center text-2xl md:text-3xl mb-10 tracking-wide text-foreground"
            style={{ fontWeight: 600 }}
          >
            Chapters of the Codex
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  className="bg-card text-card-foreground border border-border rounded-sm p-6"
                  key={feature.title}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center shrink-0">
                      <span
                        className="font-headline text-2xl md:text-3xl leading-none text-accent"
                        style={{ fontWeight: 700 }}
                      >
                        {romanNumerals[i]}
                      </span>
                      <Icon className="mt-2 w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3
                        className="text-lg md:text-xl mb-1 text-card-foreground"
                        style={{ fontWeight: 600 }}
                      >
                        {feature.title}
                      </h3>
                      <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <OrnamentDivider />

        {/* Spirit Gallery */}
        <section className="mb-4">
          <h2
            className="text-center text-2xl md:text-3xl mb-3 tracking-wide text-foreground"
            style={{ fontWeight: 600 }}
          >
            The Spirits of the Island
          </h2>
          <p className="text-center text-sm md:text-base mb-10 font-body italic text-muted-foreground">
            Featuring 8 of 37 spirits and 31 aspects
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {spirits.map((spirit) => (
              <Link
                className="bg-card border border-border rounded-sm overflow-hidden transition-all duration-200 cursor-default hover:shadow-lg hover:brightness-105 dark:hover:brightness-125 dark:hover:border-accent/40"
                key={spirit.name}
                params={{ slug: spirit.slug }}
                search={{ opening: undefined }}
                to="/spirits/$slug"
                viewTransition
              >
                <div
                  className="w-full aspect-square overflow-hidden bg-muted"
                  style={{ viewTransitionName: `spirit-image-${spirit.slug}` }}
                >
                  <img
                    alt={spirit.name}
                    className="w-full h-full object-cover"
                    src={spirit.image}
                    style={{ filter: 'sepia(0.15) contrast(0.95)' }}
                  />
                </div>
                <div className="p-3 md:p-4">
                  <h3
                    className="text-sm md:text-base leading-tight mb-2 text-card-foreground"
                    style={{ viewTransitionName: `spirit-name-${spirit.slug}`, fontWeight: 600 }}
                  >
                    {spirit.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{spirit.complexity}</span>
                    <div className="flex gap-1">
                      {spirit.elements.map((el) => (
                        <span
                          className="w-3 h-3 rounded-full"
                          key={el}
                          style={{
                            background: elementColors[el] || 'var(--muted)',
                            boxShadow: `0 0 4px ${elementColors[el] || 'var(--muted)'}`,
                          }}
                          title={el}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* "Explore more" card fills the 3-col gap on desktop */}
            <Link
              className="bg-card border border-border col-span-2 md:col-span-1 rounded-sm flex flex-col items-center justify-center gap-3 cursor-default transition-all duration-200 hover:shadow-lg hover:brightness-105 dark:hover:brightness-125 dark:hover:border-accent/40 min-h-[120px] md:min-h-0"
              to="/spirits"
            >
              <BookOpen className="w-8 h-8 text-accent" />
              <span
                className="text-sm md:text-base text-center px-4 text-muted-foreground"
                style={{ fontWeight: 600 }}
              >
                Explore all spirits
              </span>
            </Link>
          </div>
        </section>

        <OrnamentDivider />

        {/* CTA Section */}
        <section className="text-center">
          <div className="inline-block bg-card border-2 border-accent/40 rounded-sm px-8 py-10 md:px-16 md:py-14 mx-auto shadow-sm">
            <h2
              className="text-2xl md:text-3xl mb-3 tracking-wide text-card-foreground"
              style={{ fontWeight: 700 }}
            >
              Begin Your Journey
            </h2>
            <p className="font-headline italic text-sm md:text-base mb-8 text-muted-foreground">
              Open the codex and uncover the secrets within
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                className="cursor-pointer inline-flex items-center gap-2 font-headline text-sm md:text-base px-6 py-3 rounded-sm transition-shadow duration-200 bg-primary text-primary-foreground hover:shadow-[0_4px_16px_oklch(0.35_0.12_25_/_0.4)]"
                style={{ fontWeight: 600, letterSpacing: '0.04em' }}
                to="/spirits"
              >
                <BookOpen style={{ width: 18, height: 18 }} />
                Explore Spirits
              </Link>
              <Link
                className="cursor-pointer inline-flex items-center gap-2 font-headline text-sm md:text-base px-6 py-3 rounded-sm transition-shadow duration-200 border border-border text-muted-foreground hover:shadow-[0_4px_16px_oklch(0.7_0.1_70_/_0.15)]"
                style={{ fontWeight: 600, letterSpacing: '0.04em' }}
                to="/games"
              >
                <Gamepad2 style={{ width: 18, height: 18 }} />
                Track Games
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-border/50 pt-8 pb-4 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} The Dahan Codex</p>
          <p className="mt-1">
            Unofficial fan project. Spirit Island is a trademark of Greater Than Games, LLC.
          </p>
          <Link
            className="mt-2 inline-block underline underline-offset-2 hover:text-foreground transition-colors cursor-pointer"
            to="/credits"
          >
            Credits &amp; Attributions
          </Link>
        </footer>
      </div>
    </div>
  )
}
