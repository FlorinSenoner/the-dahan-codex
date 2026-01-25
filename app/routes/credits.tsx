import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/credits")({
  component: CreditsPage,
});

function CreditsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/spirits">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="font-headline text-xl font-semibold">Credits</h1>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-8">
        {/* Legal Disclaimer */}
        <section className="bg-card border border-border rounded-lg p-4">
          <h2 className="font-headline text-lg font-semibold text-foreground mb-3">
            Legal Disclaimer
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Dahan Codex is an unofficial fan project and is not affiliated
            with Greater Than Games, LLC. Spirit Island and all related
            materials, names, and images are the property of Greater Than Games,
            LLC.
          </p>
        </section>

        {/* Data Sources */}
        <section>
          <h2 className="font-headline text-lg font-semibold text-foreground mb-4">
            Data Sources
          </h2>
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
          <h2 className="font-headline text-lg font-semibold text-foreground mb-4">
            Community
          </h2>
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
          <h2 className="font-headline text-lg font-semibold text-foreground mb-4">
            Acknowledgments
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Thank you to Eric Reuss for creating Spirit Island, the wiki editors
            for maintaining comprehensive documentation, and the Spirit Island
            community for sharing strategies and openings.
          </p>
        </section>

        {/* App Info */}
        <section className="text-center pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            The Dahan Codex v1.0.0
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Made with care for the Spirit Island community
          </p>
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
