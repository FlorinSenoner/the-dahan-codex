import { ExternalLink } from "lucide-react";
import { Heading } from "@/components/ui/typography";

interface ExternalLinksProps {
  spiritName: string;
  wikiUrl?: string;
}

function ResourceLink({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{label}</span>
          <ExternalLink className="h-3 w-3 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
    </a>
  );
}

export function ExternalLinks({ spiritName, wikiUrl }: ExternalLinksProps) {
  // Build search URLs with spirit name
  const faqSearchUrl = `https://querki.net/u/darker/spirit-island-faq/#!spirit-island-faq?search=${encodeURIComponent(spiritName)}`;
  const cardSearchUrl = `https://sick.oberien.de/?query=${encodeURIComponent(spiritName)}`;

  const links = [
    wikiUrl && {
      href: wikiUrl,
      label: "Spirit Island Wiki",
      description: `Strategy guides and details for ${spiritName}`,
    },
    {
      href: faqSearchUrl,
      label: "Official FAQ",
      description: `Rules clarifications for ${spiritName}`,
    },
    {
      href: cardSearchUrl,
      label: "Card Catalogue",
      description: `Power card reference and combos`,
    },
  ].filter(Boolean) as { href: string; label: string; description: string }[];

  return (
    <section className="space-y-3 pt-4 border-t border-border">
      <Heading variant="h3" as="h2">
        Resources
      </Heading>

      <div className="space-y-2">
        {links.map((link) => (
          <ResourceLink
            key={link.href}
            href={link.href}
            label={link.label}
            description={link.description}
          />
        ))}
      </div>
    </section>
  );
}
