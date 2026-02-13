import { createFileRoute } from '@tanstack/react-router'
import { ExternalLinkCard } from '@/components/ui/external-link-card'
import { PageHeader } from '@/components/ui/page-header'
import { Heading, Text } from '@/components/ui/typography'
import { usePageMeta, useStructuredData } from '@/hooks'

export const Route = createFileRoute('/credits')({
  component: CreditsPage,
})

function CreditsPage() {
  usePageMeta({
    title: 'Credits',
    description: 'Credits and attributions for The Dahan Codex.',
    canonicalPath: '/credits',
    ogType: 'website',
  })

  const SITE_URL = 'https://dahan-codex.com'

  useStructuredData('ld-breadcrumb', {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Credits', item: `${SITE_URL}/credits` },
    ],
  })

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader backHref="/spirits" title="Credits" />

      <main className="p-4 max-w-2xl mx-auto space-y-8">
        {/* Legal Disclaimer */}
        <section>
          <Heading className="text-foreground mb-3" variant="h3">
            Legal Disclaimer
          </Heading>
          <Text className="leading-relaxed" variant="muted">
            The Dahan Codex is an unofficial fan project and is not affiliated with Greater Than
            Games, LLC. Spirit Island and all related materials, names, and images are the property
            of Greater Than Games, LLC.
          </Text>
        </section>

        {/* Data Sources */}
        <section>
          <Heading className="text-foreground mb-4" variant="h3">
            Data Sources
          </Heading>
          <div className="space-y-3">
            <ExternalLinkCard
              description="Spirit details, strategies, and rulings"
              href="https://spiritislandwiki.com"
              title="Spirit Island Wiki"
            />
            <ExternalLinkCard
              description="Opening guides and spirit strategies"
              href="https://latentoctopus.github.io"
              title="Spirit Island Hub"
            />
            <ExternalLinkCard
              description="Card images and search"
              href="https://sick.oberien.de"
              title="Spirit Island Card Catalog"
            />
            <ExternalLinkCard
              description="Official rulings and clarifications"
              href="https://querki.net/u/darker/spirit-island-faq"
              title="Spirit Island FAQ"
            />
          </div>
        </section>

        {/* Community */}
        <section>
          <Heading className="text-foreground mb-4" variant="h3">
            Community
          </Heading>
          <div className="space-y-3">
            <ExternalLinkCard
              description="Spirit Island subreddit"
              href="https://reddit.com/r/spiritisland"
              title="r/spiritisland"
            />
            <ExternalLinkCard
              description="Spirit Island on BGG"
              href="https://boardgamegeek.com/boardgame/162886/spirit-island"
              title="BoardGameGeek"
            />
          </div>
        </section>

        {/* Acknowledgments */}
        <section>
          <Heading className="text-foreground mb-4" variant="h3">
            Acknowledgments
          </Heading>
          <Text className="leading-relaxed" variant="muted">
            Thank you to Eric Reuss for creating Spirit Island, the wiki editors for maintaining
            comprehensive documentation, and the Spirit Island community for sharing strategies and
            openings.
          </Text>
        </section>

        {/* App Info */}
        <section className="text-center pt-4 border-t border-border">
          <Text variant="small">The Dahan Codex v1.0.0</Text>
          <Text className="mt-1" variant="small">
            Made with care for the Spirit Island community
          </Text>
          <Text
            asChild
            className="mt-1 inline-flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
            variant="small"
          >
            <a
              href="https://github.com/FlorinSenoner/the-dahan-codex"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Source on GitHub
            </a>
          </Text>
        </section>
      </main>
    </div>
  )
}
