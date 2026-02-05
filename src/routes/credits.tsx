import { createFileRoute } from '@tanstack/react-router'
import { ExternalLinkCard } from '@/components/ui/external-link-card'
import { PageHeader } from '@/components/ui/page-header'
import { Heading, Text } from '@/components/ui/typography'

export const Route = createFileRoute('/credits')({
  component: CreditsPage,
})

function CreditsPage() {
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
        </section>
      </main>
    </div>
  )
}
