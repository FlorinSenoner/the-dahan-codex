import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
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
            <SourceLink
              name="Spirit Island Wiki"
              url="https://spiritislandwiki.com"
              description="Spirit details, strategies, and rulings"
            />
            <SourceLink
              name="Spirit Island Card Catalog"
              url="https://sick.oberien.de"
              description="Card images and search"
            />
            <SourceLink
              name="Spirit Island FAQ"
              url="https://querki.net/u/darker/spirit-island-faq"
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
            <SourceLink
              name="r/spiritisland"
              url="https://reddit.com/r/spiritisland"
              description="Spirit Island subreddit"
            />
            <SourceLink
              name="BoardGameGeek"
              url="https://boardgamegeek.com/boardgame/162886/spirit-island"
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

function SourceLink({
  name,
  url,
  description,
}: {
  name: string;
  url: string;
  description: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{name}</span>
          <ExternalLink className="h-3 w-3 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
    </a>
  );
}
