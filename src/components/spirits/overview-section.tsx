import type { Doc } from 'convex/_generated/dataModel'
import { ChevronDown } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Heading, Text } from '@/components/ui/typography'
import { PowerRadarChart } from './power-radar-chart'

interface OverviewSectionProps {
  spirit: Doc<'spirits'>
  description?: string
}

export function OverviewSection({ spirit, description }: OverviewSectionProps) {
  const hasStrengths = spirit.strengths && spirit.strengths.length > 0
  const hasWeaknesses = spirit.weaknesses && spirit.weaknesses.length > 0
  const hasContent = spirit.powerRatings || hasStrengths || hasWeaknesses || description

  if (!hasContent) {
    return null
  }

  const content = (
    <div className="space-y-6">
      {/* Description - inside collapsible */}
      {description && (
        <Text
          className="text-foreground/80 text-center lg:text-left max-w-lg mx-auto lg:mx-0 leading-relaxed"
          variant="muted"
        >
          {description}
        </Text>
      )}

      {/* Power Ratings Radar Chart */}
      {spirit.powerRatings && (
        <div className="py-4">
          <PowerRadarChart ratings={spirit.powerRatings} />
        </div>
      )}

      {/* Strengths and Weaknesses */}
      <div className="space-y-4">
        {hasStrengths && (
          <div className="space-y-2">
            <Heading as="h3" className="text-element-plant" variant="h4">
              Strengths
            </Heading>
            <ul className="space-y-1 pl-4">
              {spirit.strengths?.map((strength) => (
                <li className="text-sm text-muted-foreground list-disc" key={strength}>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasWeaknesses && (
          <div className="space-y-2">
            <Heading as="h3" className="text-element-animal" variant="h4">
              Weaknesses
            </Heading>
            <ul className="space-y-1 pl-4">
              {spirit.weaknesses?.map((weakness) => (
                <li className="text-sm text-muted-foreground list-disc" key={weakness}>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile: Collapsible */}
      <Collapsible className="lg:hidden" defaultOpen={false}>
        <CollapsibleTrigger className="w-full flex justify-between items-center py-3 px-4 bg-muted/30 rounded-lg cursor-pointer min-h-[44px]">
          <span className="font-medium">Overview</span>
          <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">{content}</CollapsibleContent>
      </Collapsible>

      {/* Desktop: Always visible in sidebar */}
      <div className="hidden lg:block">{content}</div>
    </>
  )
}
