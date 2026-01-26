import { BookOpen, ExternalLink, HelpCircle, Search } from "lucide-react";
import { Heading, Text } from "@/components/ui/typography";

interface ExternalLinksProps {
  spiritName: string;
  wikiUrl?: string;
}

function ResourceLink({
  href,
  icon: Icon,
  label,
  description,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors group"
    >
      <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5" />
      <div className="space-y-0.5 min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-medium text-sm group-hover:text-primary">
            {label}
          </span>
          <ExternalLink className="h-3 w-3 text-muted-foreground" />
        </div>
        <Text variant="small" className="text-muted-foreground">
          {description}
        </Text>
      </div>
    </a>
  );
}

export function ExternalLinks({ spiritName, wikiUrl }: ExternalLinksProps) {
  // Build search URLs
  const faqSearchUrl = `https://querki.net/u/darker/spirit-island-faq/#!spirit-island-faq?search=${encodeURIComponent(spiritName)}`;
  const cardSearchUrl = `https://sick.oberien.de/?query=${encodeURIComponent(spiritName)}`;

  return (
    <section className="space-y-3 pt-4 border-t border-border">
      <Heading variant="h3" as="h2">
        Resources
      </Heading>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {wikiUrl && (
          <ResourceLink
            href={wikiUrl}
            icon={BookOpen}
            label="Spirit Island Wiki"
            description="Official wiki with detailed strategy guides"
          />
        )}

        <ResourceLink
          href={faqSearchUrl}
          icon={HelpCircle}
          label="FAQ & Rulings"
          description="Search official rulings and clarifications"
        />

        <ResourceLink
          href={cardSearchUrl}
          icon={Search}
          label="Card Catalogue"
          description="View full card images and artwork"
        />
      </div>

      <Text variant="small" className="text-muted-foreground text-center pt-2">
        Links open in a new tab
      </Text>
    </section>
  );
}
