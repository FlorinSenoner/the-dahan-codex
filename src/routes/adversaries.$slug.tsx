import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertTriangle, Flame, Lightbulb, ScrollText } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { AdversaryImage } from '@/components/adversaries/adversary-image'
import { TurnAccordion } from '@/components/spirits/turn-accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLinkCard } from '@/components/ui/external-link-card'
import { PageHeader } from '@/components/ui/page-header'
import { Heading, Text } from '@/components/ui/typography'
import { usePublicSnapshot } from '@/data/public-snapshot'
import { usePageMeta, useStructuredData } from '@/hooks'
import { selectAdversaryBySlug } from '@/lib/reference-selectors'
import { SITE_URL } from '@/lib/site-url'

type AdversaryRulePhaseKey =
  | 'setup'
  | 'explore'
  | 'build'
  | 'ravage'
  | 'escalation'
  | 'fearInvaderDeck'
  | 'other'

type AdversaryRulePhases = Record<AdversaryRulePhaseKey, string[]>

const PHASE_LABELS: Array<{
  key: AdversaryRulePhaseKey
  label: string
}> = [
  { key: 'setup', label: 'Setup' },
  { key: 'explore', label: 'Explore' },
  { key: 'build', label: 'Build' },
  { key: 'ravage', label: 'Ravage' },
  { key: 'escalation', label: 'Escalation' },
  { key: 'fearInvaderDeck', label: 'Fear / Invader Deck' },
  { key: 'other', label: 'Other Rules' },
]

function createEmptyPhases(): AdversaryRulePhases {
  return {
    setup: [],
    explore: [],
    build: [],
    ravage: [],
    escalation: [],
    fearInvaderDeck: [],
    other: [],
  }
}

function getResourceDescription(url: string): string {
  if (url.includes('/comments/18pins2/')) return 'Adversary design discussion.'
  if (url.includes('/comments/1foin82/')) return 'Quick matchup themes and priorities.'
  if (url.includes('/comments/198bws1/')) return 'Signature-level discussion.'
  return 'Community strategy discussion.'
}

function RuleTextSection({
  icon,
  title,
  content,
}: {
  icon: ReactNode
  title: string
  content: string
}) {
  return (
    <section className="space-y-4">
      <Heading as="h2" className="flex items-center gap-2" variant="h2">
        {icon}
        {title}
      </Heading>
      <Card className="shadow-none">
        <CardContent className="p-4">
          <Text className="whitespace-pre-line leading-relaxed">{content}</Text>
        </CardContent>
      </Card>
    </section>
  )
}

export const Route = createFileRoute('/adversaries/$slug')({
  component: AdversaryDetailPage,
})

function AdversaryDetailPage() {
  const { slug } = Route.useParams()
  const snapshot = usePublicSnapshot()
  const adversary = snapshot ? selectAdversaryBySlug(snapshot, slug) : null

  usePageMeta({
    title: adversary?.name,
    description: adversary?.strategy.overview,
    canonicalPath: `/adversaries/${slug}`,
    ogType: 'article',
  })

  useStructuredData(
    'ld-breadcrumb-adversary-detail',
    adversary
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Adversaries',
              item: `${SITE_URL}/adversaries`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: adversary.name,
              item: `${SITE_URL}/adversaries/${adversary.slug}`,
            },
          ],
        }
      : null,
  )

  const [selectedLevel, setSelectedLevel] = useState(1)

  if (!snapshot) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader backHref="/adversaries" title="Adversaries" />
      </div>
    )
  }

  if (adversary === null) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader backHref="/adversaries" title="Adversaries" />
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
          <Heading as="h1" className="mb-2" variant="h2">
            Adversary Not Found
          </Heading>
          <Text className="mb-3" variant="muted">
            The adversary "{slug}" doesn&apos;t exist.
          </Text>
          <Button asChild variant="link">
            <Link to="/adversaries" viewTransition>
              Back to Adversaries
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const levelZero = {
    level: 0,
    difficulty: adversary.baseDifficulty,
    fearCards: '',
    effectName: 'Base Adversary',
    effectText: 'No added level rules.',
    phases: createEmptyPhases(),
    cumulativePhases: createEmptyPhases(),
  }
  const levelOptions = [levelZero, ...adversary.levels]

  const currentLevel = levelOptions.find((item) => item.level === selectedLevel) ?? levelOptions[0]
  const phaseRuleTurns = PHASE_LABELS.map((phase, index) => ({
    turn: index + 1,
    title: phase.label,
    instructions: currentLevel.cumulativePhases[phase.key].map((rule) => `• ${rule}`).join('\n'),
  })).filter((phase) => phase.instructions.length > 0)

  const visibleStrategyTips = adversary.strategy.tips.filter(
    (tip) => tip.levelFocus.length === 0 || tip.levelFocus.includes(selectedLevel),
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader backHref="/adversaries" title={adversary.name} />

      <main className="p-4 lg:mx-auto lg:grid lg:max-w-6xl lg:grid-cols-[1fr_340px] lg:gap-8">
        <div className="space-y-6">
          <div className="flex justify-center">
            <AdversaryImage
              adversaryName={adversary.name}
              className="aspect-3/2 h-[300px] rounded-xl"
              fallbackInitialClassName="text-6xl"
              height={300}
              imageUrl={adversary.imageUrl}
              slug={adversary.slug}
              width={450}
            />
          </div>

          <div>
            <Heading
              as="h1"
              className="mx-auto mb-2 w-fit text-center text-foreground"
              variant="h1"
            >
              {adversary.name}
            </Heading>
            <Text className="text-center" variant="muted">
              {adversary.strategy.overview}
            </Text>
          </div>

          <RuleTextSection
            content={adversary.additionalLossCondition}
            icon={<AlertTriangle className="h-5 w-5" />}
            title="Additional Loss Condition"
          />

          <RuleTextSection
            content={adversary.escalation}
            icon={<Flame className="h-5 w-5" />}
            title="Escalation"
          />

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Heading as="h2" className="flex items-center gap-2" variant="h2">
                <ScrollText className="h-5 w-5" />
                Rules
              </Heading>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {levelOptions.map((levelData) => (
                  <Button
                    className="transition-[box-shadow,transform] duration-200"
                    key={levelData.level}
                    onClick={() => setSelectedLevel(levelData.level)}
                    size="sm"
                    variant={selectedLevel === levelData.level ? 'default' : 'outline'}
                  >
                    {selectedLevel === levelData.level
                      ? `Level ${levelData.level} • Difficulty ${levelData.difficulty}`
                      : `L${levelData.level}`}
                  </Button>
                ))}
              </div>
            </div>

            <Card className="shadow-none">
              <CardContent className="space-y-4 p-4">
                <div
                  className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-safe:duration-200"
                  key={`rules-level-${selectedLevel}`}
                >
                  {phaseRuleTurns.length > 0 ? (
                    <TurnAccordion turns={phaseRuleTurns} />
                  ) : (
                    <Text className="text-sm text-muted-foreground">
                      No phase-specific rules at this level.
                    </Text>
                  )}
                </div>

                <div className="border-t border-border pt-2 text-xs text-muted-foreground">
                  <span>Spirit Island Wiki</span>
                  <span> · </span>
                  <a
                    className="text-primary hover:underline"
                    href={adversary.wikiUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Source
                    <span className="sr-only">(opens in new tab)</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <Heading as="h2" className="flex items-center gap-2" variant="h2">
              <Lightbulb className="h-5 w-5" />
              Strategy
            </Heading>

            <div className="space-y-3">
              {visibleStrategyTips.map((tip) => (
                <Card className="shadow-none" key={tip.id}>
                  <CardContent className="p-3">
                    <Heading as="h3" variant="h4">
                      {tip.title}
                    </Heading>
                    <Text className="mt-1 leading-relaxed" variant="muted">
                      {tip.summary}
                    </Text>
                    {tip.levelFocus.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline">Levels {tip.levelFocus.join(', ')}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              {visibleStrategyTips.length === 0 ? (
                <Text className="text-sm text-muted-foreground">
                  No focused strategy guidance is available for level {selectedLevel} yet.
                </Text>
              ) : null}
            </div>

            <section className="space-y-3 border-t border-border pt-4">
              <Heading as="h3" variant="h3">
                Resources
              </Heading>

              <div className="space-y-2">
                {adversary.strategy.sources.slice(0, 3).map((source) => (
                  <ExternalLinkCard
                    description={getResourceDescription(source.url)}
                    href={source.url}
                    key={source.id}
                    title={source.title}
                  />
                ))}
              </div>
            </section>
          </section>
        </div>
      </main>
    </div>
  )
}
