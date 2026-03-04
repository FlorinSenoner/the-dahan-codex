import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen, Compass, Gamepad2, Shield, WifiOff } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { AdversaryImage } from '@/components/adversaries/adversary-image'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { usePublicSnapshot } from '@/data/public-snapshot'
import { usePageMeta, useStructuredData } from '@/hooks'
import { selectAdversaryList } from '@/lib/reference-selectors'
import { SITE_URL } from '@/lib/site-url'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const spirits = [
  {
    name: "Lightning's Swift Strike",
    slug: 'lightnings-swift-strike',
    image: '/spirits/lightnings-swift-strike.webp',
    complexity: 'Low',
    elements: ['Fire', 'Air'],
  },
  {
    name: 'River Surges in Sunlight',
    slug: 'river-surges-in-sunlight',
    image: '/spirits/river-surges-in-sunlight.webp',
    complexity: 'Low',
    elements: ['Sun', 'Water'],
  },
  {
    name: 'Vital Strength of the Earth',
    slug: 'vital-strength-of-the-earth',
    image: '/spirits/vital-strength-of-the-earth.webp',
    complexity: 'Low',
    elements: ['Earth', 'Plant'],
  },
  {
    name: 'Shadows Flicker Like Flame',
    slug: 'shadows-flicker-like-flame',
    image: '/spirits/shadows-flicker-like-flame.webp',
    complexity: 'Low',
    elements: ['Moon', 'Fire', 'Air'],
  },
  {
    name: 'Thunderspeaker',
    slug: 'thunderspeaker',
    image: '/spirits/thunderspeaker.webp',
    complexity: 'Moderate',
    elements: ['Sun', 'Air'],
  },
  {
    name: 'A Spread of Rampant Green',
    slug: 'a-spread-of-rampant-green',
    image: '/spirits/a-spread-of-rampant-green.webp',
    complexity: 'Moderate',
    elements: ['Plant', 'Water'],
  },
  {
    name: "Ocean's Hungry Grasp",
    slug: 'oceans-hungry-grasp',
    image: '/spirits/oceans-hungry-grasp.webp',
    complexity: 'High',
    elements: ['Water', 'Moon', 'Earth'],
  },
  {
    name: 'Bringer of Dreams and Nightmares',
    slug: 'bringer-of-dreams-and-nightmares',
    image: '/spirits/bringer-of-dreams-and-nightmares.webp',
    complexity: 'High',
    elements: ['Moon', 'Air'],
  },
]

const features = [
  {
    icon: BookOpen,
    title: 'Spirit Library',
    description:
      'Find spirit details fast: complexity, elements, special rules, and quick setup summaries in one place.',
  },
  {
    icon: Shield,
    title: 'Adversary Dossiers',
    description:
      'Review escalation, loss conditions, and level-by-level pressure so you can pick the right challenge.',
  },
  {
    icon: Compass,
    title: 'Opening Guides',
    description:
      'Follow practical turn-by-turn openings and adapt them to the adversary matchup at your table.',
  },
  {
    icon: WifiOff,
    title: 'Tracker + Offline Play',
    description:
      'Log outcomes when you want long-term notes, and keep core references available when your room has no signal.',
  },
]

const faqItems = [
  {
    question: 'What is The Dahan Codex?',
    answer:
      'The Dahan Codex is a fan-made Spirit Island companion for table-speed decisions. It brings together spirits, aspects, adversaries, opening guides, and optional game tracking in one place.',
  },
  {
    question: 'What do adversary pages include?',
    answer:
      'Each adversary page includes base difficulty, escalation, additional loss condition, and level-by-level rules. You also get practical strategy notes so you can prep for the pressure points that matter most.',
  },
  {
    question: 'Are adversary strategy notes official rulings?',
    answer:
      'No. Strategy notes are player-facing guidance, not official rulings. Official rulebooks, FAQs, and published content remain the final authority for gameplay interpretation.',
  },
  {
    question: 'Does it work offline?',
    answer:
      'Yes. After your first visit, the app caches core reference content, including spirits and adversaries, so you can keep using it with limited or no connection. It is built as a Progressive Web App and can be installed on mobile or desktop.',
  },
  {
    question: 'Do I need an account?',
    answer:
      'No account is required for spirits, adversaries, or opening guides. Sign in is only needed if you want to save and sync game tracking data between devices.',
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
  const imageRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const nameRefs = useRef<Record<string, HTMLHeadingElement | null>>({})
  const snapshot = usePublicSnapshot()
  const featuredAdversaries = useMemo(
    () => (snapshot ? selectAdversaryList(snapshot).slice(0, 5) : []),
    [snapshot],
  )

  usePageMeta({
    title: 'Spirit Island Companion App',
    description:
      'Reference spirits, aspects, and adversaries, follow turn-by-turn openings, and track games across devices in The Dahan Codex.',
    canonicalPath: '/',
    ogType: 'website',
  })

  useStructuredData('ld-webapp', {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'The Dahan Codex',
    url: SITE_URL,
    description:
      'Spirit Island companion app with spirit and adversary reference, opening guides, game tracking, and offline support.',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: [
      'Reference spirits, aspects, and adversaries',
      'Turn-by-turn openings with matchup context',
      'Game tracker with cross-device sync',
      'Offline-ready Progressive Web App',
    ],
  })

  useStructuredData('ld-faq', {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  })

  useStructuredData('ld-breadcrumb', {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
    ],
  })

  return (
    <div className="min-h-screen pb-20 bg-background text-foreground">
      <div className="max-w-[900px] mx-auto px-6 pt-12 md:pt-20">
        <header className="text-center mb-4">
          <h1 className="sr-only">The Dahan Codex — Spirit Island Companion App</h1>
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
            Know your spirit before the invaders land.
          </p>
          <p className="text-sm md:text-base mt-2 text-muted-foreground max-w-xl mx-auto">
            Reference spirits quickly, follow practical opening lines, and track games across
            devices.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 font-headline text-sm md:text-base px-6 py-3 rounded-sm transition-shadow duration-200 bg-primary text-primary-foreground hover:shadow-[0_4px_16px_oklch(0.35_0.12_25_/_0.4)]"
              style={{ fontWeight: 600, letterSpacing: '0.04em' }}
              to="/spirits"
            >
              <BookOpen style={{ width: 18, height: 18 }} />
              Explore Spirits
            </Link>
            <Link
              className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 font-headline text-sm md:text-base px-6 py-3 rounded-sm transition-shadow duration-200 border border-border text-muted-foreground hover:shadow-[0_4px_16px_oklch(0.7_0.1_70_/_0.15)]"
              style={{ fontWeight: 600, letterSpacing: '0.04em' }}
              to="/games"
            >
              <Gamepad2 style={{ width: 18, height: 18 }} />
              Track Games
            </Link>
          </div>
        </header>

        <OrnamentDivider />

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

        <section className="mb-4">
          <h2
            className="text-center text-2xl md:text-3xl mb-3 tracking-wide text-foreground"
            style={{ fontWeight: 600 }}
          >
            The Spirits of the Island
          </h2>
          <p className="text-center text-sm md:text-base mb-10 font-body italic text-muted-foreground">
            Featuring 8 spirits from the full roster
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {spirits.map((spirit) => (
              <Link
                className="bg-card border border-border rounded-sm overflow-hidden transition-[box-shadow,filter,border-color] duration-200 cursor-default hover:shadow-lg hover:brightness-105 dark:hover:brightness-125 dark:hover:border-accent/40"
                key={spirit.name}
                onClick={() => {
                  const img = imageRefs.current[spirit.slug]
                  const name = nameRefs.current[spirit.slug]
                  if (img) img.style.viewTransitionName = `spirit-image-${spirit.slug}`
                  if (name) name.style.viewTransitionName = `spirit-name-${spirit.slug}`
                }}
                params={{ slug: spirit.slug }}
                search={{ opening: undefined }}
                to="/spirits/$slug"
                viewTransition
              >
                <div
                  className="w-full aspect-square overflow-hidden bg-muted"
                  ref={(el) => {
                    imageRefs.current[spirit.slug] = el
                  }}
                >
                  <img
                    alt={spirit.name}
                    className="w-full h-full object-cover"
                    height={512}
                    loading="lazy"
                    src={spirit.image}
                    style={{ filter: 'sepia(0.15) contrast(0.95)' }}
                    width={512}
                  />
                </div>
                <div className="p-3 md:p-4">
                  <h3
                    className="text-sm md:text-base leading-tight mb-2 text-card-foreground"
                    ref={(el) => {
                      nameRefs.current[spirit.slug] = el
                    }}
                    style={{ fontWeight: 600 }}
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

            <Link
              className="bg-card border border-border col-span-2 md:col-span-1 rounded-sm flex flex-col items-center justify-center gap-3 cursor-default transition-[box-shadow,filter,border-color] duration-200 hover:shadow-lg hover:brightness-105 dark:hover:brightness-125 dark:hover:border-accent/40 min-h-[120px] md:min-h-0"
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

        <section className="mb-4">
          <h2
            className="text-center text-2xl md:text-3xl mb-3 tracking-wide text-foreground"
            style={{ fontWeight: 600 }}
          >
            The Adversaries of the Island
          </h2>
          <p className="text-center text-sm md:text-base mb-10 font-body italic text-muted-foreground">
            Featuring 5 adversaries from the full roster
          </p>

          {snapshot === undefined ? (
            <p className="text-center text-sm mb-6 text-muted-foreground">Loading adversaries...</p>
          ) : featuredAdversaries.length === 0 ? (
            <p className="text-center text-sm mb-6 text-muted-foreground">
              No adversaries available.
            </p>
          ) : null}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {featuredAdversaries.map((adversary) => (
              <Link
                className="bg-card border border-border rounded-sm overflow-hidden transition-[box-shadow,filter,border-color] duration-200 cursor-default hover:shadow-lg hover:brightness-105 dark:hover:brightness-125 dark:hover:border-accent/40"
                key={adversary._id}
                params={{ slug: adversary.slug }}
                to="/adversaries/$slug"
                viewTransition
              >
                <AdversaryImage
                  adversaryName={adversary.name}
                  className="w-full aspect-square rounded-none"
                  height={512}
                  imageUrl={adversary.imageUrl}
                  imgClassName="sepia-[0.15] contrast-[0.95]"
                  slug={adversary.slug}
                  width={512}
                />
                <div className="p-3 md:p-4">
                  <h3
                    className="text-sm md:text-base leading-tight mb-2 text-card-foreground"
                    style={{
                      fontWeight: 600,
                      viewTransitionName: `adversary-name-${adversary.slug}`,
                    }}
                  >
                    {adversary.name}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Base {adversary.baseDifficulty}</p>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                      {adversary.strategy.overview}
                    </p>
                  </div>
                </div>
              </Link>
            ))}

            <Link
              className="bg-card border border-border col-span-2 md:col-span-1 rounded-sm flex flex-col items-center justify-center gap-3 cursor-default transition-[box-shadow,filter,border-color] duration-200 hover:shadow-lg hover:brightness-105 dark:hover:brightness-125 dark:hover:border-accent/40 min-h-[120px] md:min-h-0"
              to="/adversaries"
            >
              <Shield className="w-8 h-8 text-accent" />
              <span
                className="text-sm md:text-base text-center px-4 text-muted-foreground"
                style={{ fontWeight: 600 }}
              >
                Explore all adversaries
              </span>
            </Link>
          </div>
        </section>

        <OrnamentDivider />

        <section className="mb-4">
          <h2
            className="text-center text-2xl md:text-3xl mb-6 tracking-wide text-foreground"
            style={{ fontWeight: 600 }}
          >
            How It Helps at the Table
          </h2>
          <div className="max-w-[680px] mx-auto space-y-4 text-sm md:text-base leading-relaxed text-muted-foreground">
            <p>
              Spirit Island rewards planning, and your first decisions are usually spirit plus
              adversary pressure. The Codex is organized so you can compare both quickly instead of
              bouncing between long notes.
            </p>
            <p>
              Most players use it as a table loop: pick spirit and adversary level, check escalation
              and loss conditions, run an opening line, then return for quick reminders during play.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Choose your spirit plan and confirm the adversary level pressure up front.</li>
              <li>Check escalation and additional loss conditions before turn one surprises.</li>
              <li>Pair opening steps with the matchup so early turns stay intentional.</li>
              <li>Track finished games when you want long-term spirit-versus-adversary notes.</li>
            </ul>
          </div>
        </section>

        <OrnamentDivider />

        <section className="mb-4">
          <h2
            className="text-center text-2xl md:text-3xl mb-8 tracking-wide text-foreground"
            style={{ fontWeight: 600 }}
          >
            Common Questions
          </h2>
          <div className="max-w-[680px] mx-auto">
            <Accordion collapsible type="single">
              {faqItems.map((item, i) => (
                <AccordionItem key={item.question} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-foreground cursor-pointer">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <OrnamentDivider />

        <section className="text-center">
          <div className="inline-block bg-card border-2 border-accent/40 rounded-sm px-8 py-10 md:px-16 md:py-14 mx-auto shadow-sm">
            <h2
              className="text-2xl md:text-3xl mb-3 tracking-wide text-card-foreground"
              style={{ fontWeight: 700 }}
            >
              Ready for Your Next Game Night
            </h2>
            <p className="text-xs mb-8 text-muted-foreground">
              Free to use. No account needed for reference and openings.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 font-headline text-sm md:text-base px-6 py-3 rounded-sm transition-shadow duration-200 bg-primary text-primary-foreground hover:shadow-[0_4px_16px_oklch(0.35_0.12_25_/_0.4)]"
                style={{ fontWeight: 600, letterSpacing: '0.04em' }}
                to="/spirits"
              >
                <BookOpen style={{ width: 18, height: 18 }} />
                Explore Spirits
              </Link>
              <Link
                className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 font-headline text-sm md:text-base px-6 py-3 rounded-sm transition-shadow duration-200 border border-border text-muted-foreground hover:shadow-[0_4px_16px_oklch(0.7_0.1_70_/_0.15)]"
                style={{ fontWeight: 600, letterSpacing: '0.04em' }}
                to="/games"
              >
                <Gamepad2 style={{ width: 18, height: 18 }} />
                Track Games
              </Link>
            </div>
          </div>
        </section>

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
