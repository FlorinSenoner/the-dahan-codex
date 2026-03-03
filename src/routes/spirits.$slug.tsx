import {
  createFileRoute,
  Link,
  Outlet,
  useBlocker,
  useMatches,
  useNavigate,
  useParams,
} from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { EditFab } from '@/components/admin/edit-fab'
import { ExternalLinks } from '@/components/spirits/external-links'
import { OpeningSection } from '@/components/spirits/opening-section'
import { OverviewSection } from '@/components/spirits/overview-section'
import { SetupSection } from '@/components/spirits/setup-section'
import { VariantTabs } from '@/components/spirits/variant-tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heading, Text } from '@/components/ui/typography'
import { usePublicSnapshot } from '@/data/public-snapshot'
import { useAdmin, useEditMode, usePageMeta, useStructuredData } from '@/hooks'
import { selectSpiritWithAspects } from '@/lib/reference-selectors'
import { toAspectSlug } from '@/lib/slug'
import {
  complexityBadgeColors,
  elementBadgeColors,
  PLACEHOLDER_GRADIENT,
} from '@/lib/spirit-colors'
import { cn } from '@/lib/utils'
import type { PublicSpirit } from '@/types/reference'

export const Route = createFileRoute('/spirits/$slug')({
  validateSearch: (search: Record<string, unknown>) => ({
    opening: typeof search.opening === 'string' ? search.opening : undefined,
  }),
  component: SpiritDetailLayout,
})

function SpiritDetailLayout() {
  const { slug } = Route.useParams()
  const navigate = useNavigate()
  const matches = useMatches()
  const params = useParams({ strict: false })
  const snapshot = usePublicSnapshot()

  const goBack = useCallback(() => {
    navigate({ to: '/spirits', viewTransition: true })
  }, [navigate])

  const [tabsVisible, setTabsVisible] = useState(true)
  const handleVisibilityChange = useCallback((visible: boolean) => {
    setTabsVisible(visible)
  }, [])

  const hasChildRoute = matches.some((m) => m.routeId === '/spirits/$slug/$aspect')
  const currentAspect = (params as { aspect?: string }).aspect

  useEffect(() => {
    const key = currentAspect ? `${slug}-${currentAspect}` : slug
    sessionStorage.setItem('lastViewedSpirit', key)
  }, [slug, currentAspect])

  const spiritData = snapshot ? selectSpiritWithAspects(snapshot, slug) : undefined

  usePageMeta({
    title: spiritData?.base.name,
    description: spiritData?.base.summary,
    canonicalPath: `/spirits/${slug}`,
    ogType: 'article',
  })

  const SITE_URL = 'https://dahan-codex.com'

  useStructuredData(
    'ld-article',
    spiritData && !hasChildRoute
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `${spiritData.base.name} — Spirit Island Spirit Guide`,
          description: spiritData.base.summary || '',
          image: spiritData.base.imageUrl ? `${SITE_URL}${spiritData.base.imageUrl}` : undefined,
          url: `${SITE_URL}/spirits/${slug}`,
          author: { '@type': 'Organization', name: 'The Dahan Codex' },
          publisher: { '@type': 'Organization', name: 'The Dahan Codex' },
          mainEntityOfPage: `${SITE_URL}/spirits/${slug}`,
          keywords: [
            'Spirit Island',
            spiritData.base.name,
            `${spiritData.base.complexity} complexity`,
            ...spiritData.base.elements,
            'opening guide',
          ],
        }
      : null,
  )

  useStructuredData(
    'ld-breadcrumb',
    spiritData
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Spirits', item: `${SITE_URL}/spirits` },
            {
              '@type': 'ListItem',
              position: 3,
              name: spiritData.base.name,
              item: `${SITE_URL}/spirits/${slug}`,
            },
          ],
        }
      : null,
  )

  if (!snapshot || spiritData === undefined) {
    return null
  }

  if (spiritData === null) {
    return (
      <div className="min-h-screen bg-background">
        <header
          className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3"
          style={{ viewTransitionName: 'page-header' }}
        >
          <Button
            aria-label="Back to spirits"
            className="min-w-[44px] min-h-[44px] cursor-pointer hover:bg-transparent hover:ring-1 hover:ring-border dark:hover:ring-muted-foreground dark:hover:text-foreground"
            onClick={goBack}
            size="icon"
            variant="ghost"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </header>
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
          <p className="text-xl font-serif text-foreground mb-2">Spirit Not Found</p>
          <p className="text-muted-foreground mb-4">The spirit "{slug}" doesn't exist.</p>
          <Link
            className="text-primary hover:underline cursor-pointer"
            to="/spirits"
            viewTransition
          >
            Back to Spirits
          </Link>
        </div>
      </div>
    )
  }

  const { base, aspects } = spiritData
  const hasAspects = aspects.length > 0

  const currentAspectData = currentAspect
    ? aspects.find(
        (aspect) => aspect.aspectName && toAspectSlug(aspect.aspectName) === currentAspect,
      )
    : null
  const aspectDisplayName = currentAspectData?.aspectName

  const showAspectInHeader = !tabsVisible && aspectDisplayName

  return (
    <div className="min-h-screen bg-background pb-20">
      <header
        className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3"
        style={{ viewTransitionName: 'page-header' }}
      >
        <div className="flex items-center gap-3">
          <Button
            aria-label="Back to spirits"
            className="min-w-[44px] min-h-[44px] cursor-pointer hover:bg-transparent hover:ring-1 hover:ring-border dark:hover:ring-muted-foreground dark:hover:text-foreground"
            onClick={goBack}
            size="icon"
            variant="ghost"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-lg font-medium truncate">{base.name}</span>
            {showAspectInHeader && (
              <span className="text-xs text-muted-foreground truncate">{aspectDisplayName}</span>
            )}
          </div>
        </div>
      </header>

      {hasAspects && (
        <VariantTabs aspects={aspects} base={base} onVisibilityChange={handleVisibilityChange} />
      )}

      {hasChildRoute ? <Outlet /> : <SpiritDetailContent slug={slug} spirit={base} />}
    </div>
  )
}

interface SpiritDetailContentProps {
  spirit: PublicSpirit
  slug: string
  aspect?: string
}

export function SpiritDetailContent({ spirit, slug, aspect }: SpiritDetailContentProps) {
  const [imgError, setImgError] = useState(false)
  const [setupHasChanges, setSetupHasChanges] = useState(false)
  const [openingHasChanges, setOpeningHasChanges] = useState(false)
  const [setupSaveHandler, setSetupSaveHandler] = useState<(() => Promise<void>) | null>(null)
  const [openingSaveHandler, setOpeningSaveHandler] = useState<(() => Promise<void>) | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [setupIsValid, setSetupIsValid] = useState(true)
  const [openingIsValid, setOpeningIsValid] = useState(true)
  const isAdmin = useAdmin()
  const { isEditing, setEditing } = useEditMode()
  const hasChanges = setupHasChanges || openingHasChanges
  const isValid = (!setupHasChanges || setupIsValid) && (!openingHasChanges || openingIsValid)

  const handleSetupHasChangesChange = useCallback((value: boolean) => {
    setSetupHasChanges(value)
  }, [])

  const handleOpeningHasChangesChange = useCallback((value: boolean) => {
    setOpeningHasChanges(value)
  }, [])

  const handleSetupSaveHandlerReady = useCallback((handler: (() => Promise<void>) | null) => {
    setSetupSaveHandler(() => handler)
  }, [])

  const handleOpeningSaveHandlerReady = useCallback((handler: (() => Promise<void>) | null) => {
    setOpeningSaveHandler(() => handler)
  }, [])

  const handleSetupIsValidChange = useCallback((value: boolean) => {
    setSetupIsValid(value)
  }, [])

  const handleOpeningIsValidChange = useCallback((value: boolean) => {
    setOpeningIsValid(value)
  }, [])

  const blockerConditionRef = useRef({ isEditing, hasChanges, isSaving })
  blockerConditionRef.current = { isEditing, hasChanges, isSaving }

  const shouldBlock = () => {
    const {
      isEditing: editMode,
      hasChanges: hasUnsavedChanges,
      isSaving: saving,
    } = blockerConditionRef.current
    return editMode && hasUnsavedChanges && !saving
  }

  const blocker = useBlocker({
    shouldBlockFn: shouldBlock,
    enableBeforeUnload: shouldBlock,
    withResolver: true,
  })

  const handleSave = useCallback(async () => {
    if (!hasChanges) return
    setIsSaving(true)
    try {
      if (setupHasChanges && setupSaveHandler) {
        await setupSaveHandler()
      }
      if (openingHasChanges && openingSaveHandler) {
        await openingSaveHandler()
      }
      setEditing(false)
    } finally {
      setIsSaving(false)
    }
  }, [
    hasChanges,
    setupHasChanges,
    setupSaveHandler,
    openingHasChanges,
    openingSaveHandler,
    setEditing,
  ])

  const imageUrl = spirit.imageUrl
  // biome-ignore lint/correctness/useExhaustiveDependencies: imageUrl triggers reset intentionally
  useEffect(() => {
    setImgError(false)
  }, [imageUrl])

  const displayName = spirit.aspectName || spirit.name
  const viewTransitionName = aspect ? `spirit-image-${slug}-${aspect}` : `spirit-image-${slug}`
  const nameTransitionName = aspect ? `spirit-name-${slug}-${aspect}` : `spirit-name-${slug}`

  return (
    <main className="p-4 lg:grid lg:grid-cols-[1fr_340px] lg:gap-8 lg:max-w-6xl lg:mx-auto">
      <div className="space-y-6">
        <div className="flex justify-center">
          <div
            className="h-[300px] aspect-3/2 contain-[layout] overflow-hidden rounded-xl"
            style={{ viewTransitionName }}
          >
            {imgError || !spirit.imageUrl ? (
              <div
                className="w-full h-full flex items-center justify-center text-muted-foreground"
                style={{ background: PLACEHOLDER_GRADIENT }}
              >
                <span className="text-6xl font-headline">{displayName?.[0] || '?'}</span>
              </div>
            ) : (
              <img
                alt={displayName}
                className="w-full h-full object-cover"
                height={300}
                onError={() => setImgError(true)}
                src={spirit.imageUrl}
                width={450}
              />
            )}
          </div>
        </div>

        <div>
          <Heading
            as="h1"
            className="text-foreground text-center mb-2 w-fit mx-auto"
            style={{
              viewTransitionName: nameTransitionName,
            }}
            variant="h1"
          >
            {displayName}
          </Heading>

          {spirit.aspectName && (
            <Text className="text-center mb-2" variant="muted">
              Aspect of {spirit.name}
            </Text>
          )}

          <div className="flex flex-wrap justify-center gap-2 mt-2 mb-4">
            <Badge
              className={cn('text-sm', complexityBadgeColors[spirit.complexity] || '')}
              variant="outline"
            >
              {spirit.complexity} Complexity
            </Badge>
            {spirit.elements.map((element) => (
              <Badge
                className={cn('text-xs', elementBadgeColors[element] || '')}
                key={element}
                variant="outline"
              >
                {element}
              </Badge>
            ))}
          </div>

          <Text className="text-muted-foreground text-center max-w-md mx-auto">
            {spirit.summary}
          </Text>
        </div>

        <SetupSection
          onHasChangesChange={handleSetupHasChangesChange}
          onIsValidChange={handleSetupIsValidChange}
          onSaveHandlerReady={handleSetupSaveHandlerReady}
          spirit={spirit}
        />

        <div className="lg:hidden">
          <OverviewSection description={spirit.description} spirit={spirit} />
        </div>

        <OpeningSection
          onHasChangesChange={handleOpeningHasChangesChange}
          onIsValidChange={handleOpeningIsValidChange}
          onSaveHandlerReady={handleOpeningSaveHandlerReady}
          spiritId={spirit._id}
        />

        <ExternalLinks spiritName={spirit.name} wikiUrl={spirit.wikiUrl} />
      </div>

      <aside className="hidden lg:block lg:sticky lg:top-28 lg:self-start">
        <OverviewSection description={spirit.description} spirit={spirit} />
      </aside>

      {isAdmin && (
        <EditFab
          hasChanges={hasChanges}
          isSaving={isSaving}
          isValid={isValid}
          onSave={handleSave}
        />
      )}

      <AlertDialog open={blocker.status === 'blocked'}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave? Your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => blocker.reset?.()}>Stay</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => blocker.proceed?.()}
            >
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
