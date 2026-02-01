import { createFileRoute } from "@tanstack/react-router";
import { ExternalLinkCard } from "@/components/ui/external-link-card";
import { PageHeader } from "@/components/ui/page-header";
import { Heading, Text } from "@/components/ui/typography";

export const Route = createFileRoute("/credits")({
  component: CreditsPage,
});

function CreditsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Credits" backHref="/spirits" />

      <main className="p-4 max-w-2xl mx-auto space-y-8">
        {/* Legal Disclaimer */}
        <section className="bg-card border border-border rounded-lg p-4">
          <Heading variant="h3" className="text-foreground mb-3">
            Legal Disclaimer
          </Heading>
          <Text variant="muted" className="leading-relaxed">
            The Dahan Codex is an unofficial fan project and is not affiliated
            with Greater Than Games, LLC. Spirit Island and all related
            materials, names, and images are the property of Greater Than Games,
            LLC.
          </Text>
        </section>

        {/* Data Sources */}
        <section>
          <Heading variant="h3" className="text-foreground mb-4">
            Data Sources
          </Heading>
          <div className="space-y-3">
            <ExternalLinkCard
              title="Spirit Island Wiki"
              href="https://spiritislandwiki.com"
              description="Spirit details, strategies, and rulings"
            />
            <ExternalLinkCard
              title="Spirit Island Card Catalog"
              href="https://sick.oberien.de"
              description="Card images and search"
            />
            <ExternalLinkCard
              title="Spirit Island FAQ"
              href="https://querki.net/u/darker/spirit-island-faq"
              description="Official rulings and clarifications"
            />
          </div>
        </section>

        {/* Community */}
        <section>
          <Heading variant="h3" className="text-foreground mb-4">
            Community
          </Heading>
          <div className="space-y-3">
            <ExternalLinkCard
              title="r/spiritisland"
              href="https://reddit.com/r/spiritisland"
              description="Spirit Island subreddit"
            />
            <ExternalLinkCard
              title="BoardGameGeek"
              href="https://boardgamegeek.com/boardgame/162886/spirit-island"
              description="Spirit Island on BGG"
            />
          </div>
        </section>

        {/* Acknowledgments */}
        <section>
          <Heading variant="h3" className="text-foreground mb-4">
            Acknowledgments
          </Heading>
          <Text variant="muted" className="leading-relaxed">
            Thank you to Eric Reuss for creating Spirit Island, the wiki editors
            for maintaining comprehensive documentation, and the Spirit Island
            community for sharing strategies and openings.
          </Text>
        </section>

        {/* App Info */}
        <section className="text-center pt-4 border-t border-border">
          <Text variant="small">The Dahan Codex v1.0.0</Text>
          <Text variant="small" className="mt-1">
            Made with care for the Spirit Island community
          </Text>
        </section>
      </main>
    </div>
  );
}
