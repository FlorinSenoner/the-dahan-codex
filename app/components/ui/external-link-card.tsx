import { ExternalLink } from "lucide-react";

interface ExternalLinkCardProps {
  href: string;
  title: string;
  description: string;
}

export function ExternalLinkCard({
  href,
  title,
  description,
}: ExternalLinkCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors cursor-pointer"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{title}</span>
          <ExternalLink className="h-3 w-3 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
    </a>
  );
}
