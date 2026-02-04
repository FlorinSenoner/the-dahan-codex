import { ExternalLinkCard } from '@/components/ui/external-link-card'
import { Heading } from '@/components/ui/typography'

interface ExternalLinksProps {
  spiritName: string
  wikiUrl?: string
}

export function ExternalLinks({ spiritName, wikiUrl }: ExternalLinksProps) {
  // Build search URLs with spirit name
  const faqSearchUrl = `https://querki.net/u/darker/spirit-island-faq/#!spirit-island-faq?search=${encodeURIComponent(spiritName)}`
  const cardSearchUrl = `https://sick.oberien.de/?query=${encodeURIComponent(spiritName)}`

  const links = [
    wikiUrl && {
      href: wikiUrl,
      label: 'Spirit Island Wiki',
      description: `Strategy guides and details for ${spiritName}`,
    },
    {
      href: faqSearchUrl,
      label: 'Official FAQ',
      description: `Rules clarifications for ${spiritName}`,
    },
    {
      href: cardSearchUrl,
      label: 'Card Catalogue',
      description: `Power card reference and combos`,
    },
  ].filter(Boolean) as { href: string; label: string; description: string }[]

  return (
    <section className="space-y-3 pt-4 border-t border-border">
      <Heading as="h2" variant="h3">
        Resources
      </Heading>

      <div className="space-y-2">
        {links.map((link) => (
          <ExternalLinkCard
            description={link.description}
            href={link.href}
            key={link.href}
            title={link.label}
          />
        ))}
      </div>
    </section>
  )
}
