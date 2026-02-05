import { useNavigate, useParams } from '@tanstack/react-router'
import type { Doc } from 'convex/_generated/dataModel'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { slugify } from '@/lib/utils'

interface VariantTabsProps {
  base: Doc<'spirits'>
  aspects: Doc<'spirits'>[]
  onVisibilityChange?: (visible: boolean) => void
}

export function VariantTabs({ base, aspects, onVisibilityChange }: VariantTabsProps) {
  const params = useParams({ strict: false })
  const navigate = useNavigate()

  // Scroll detection for tabs visibility
  const { ref: tabsRef, inView: tabsVisible } = useInView({
    threshold: 0,
    rootMargin: '-57px 0px 0px 0px', // Header height offset (negative shrinks detection area)
  })

  // Notify parent when visibility changes
  useEffect(() => {
    onVisibilityChange?.(tabsVisible)
  }, [tabsVisible, onVisibilityChange])

  // Determine current tab from URL
  const aspect = (params as { aspect?: string }).aspect
  const currentValue = aspect || 'base'

  const tabTriggerClassName =
    'min-w-fit min-h-[44px] shrink-0 cursor-pointer rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent dark:data-[state=active]:border-transparent dark:data-[state=active]:border-b-primary text-muted-foreground hover:text-foreground transition-colors'

  return (
    <Tabs
      className="w-full"
      onValueChange={(value) => {
        const path = value === 'base' ? `/spirits/${base.slug}` : `/spirits/${base.slug}/${value}`
        navigate({ to: path, viewTransition: true })
      }}
      value={currentValue}
    >
      <TabsList
        className="sticky top-[57px] z-0 w-full h-auto min-h-[44px] justify-start overflow-x-auto overflow-y-hidden bg-background/95 backdrop-blur border-b border-border rounded-none gap-0"
        ref={tabsRef}
      >
        <TabsTrigger className={tabTriggerClassName} value="base">
          Base
        </TabsTrigger>
        {aspects.map((a) => (
          <TabsTrigger
            className={tabTriggerClassName}
            key={a.aspectName}
            value={a.aspectName ? slugify(a.aspectName) : ''}
          >
            {a.aspectName}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
