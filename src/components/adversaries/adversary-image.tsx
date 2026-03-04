import { useEffect, useState } from 'react'
import { PLACEHOLDER_GRADIENT } from '@/lib/spirit-colors'
import { cn } from '@/lib/utils'

interface AdversaryImageProps {
  adversaryName: string
  imageUrl?: string | null
  slug: string
  width: number
  height: number
  className?: string
  imgClassName?: string
  fallbackInitialClassName?: string
}

export function AdversaryImage({
  adversaryName,
  imageUrl,
  slug,
  width,
  height,
  className,
  imgClassName,
  fallbackInitialClassName,
}: AdversaryImageProps) {
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    // Reset fallback state whenever a new image is rendered in this slot.
    void imageUrl
    setImgError(false)
  }, [imageUrl])

  return (
    <div
      className={cn('relative contain-[layout] overflow-hidden rounded-lg', className)}
      style={{ viewTransitionName: `adversary-image-${slug}` }}
    >
      {imgError || !imageUrl ? (
        <div
          className="flex h-full w-full items-center justify-center text-muted-foreground"
          style={{ background: PLACEHOLDER_GRADIENT }}
        >
          <span className={cn('font-headline', fallbackInitialClassName)}>
            {adversaryName[0] || '?'}
          </span>
        </div>
      ) : (
        <img
          alt={adversaryName}
          className={cn('h-full w-full object-cover', imgClassName)}
          height={height}
          onError={() => setImgError(true)}
          src={imageUrl}
          width={width}
        />
      )}
    </div>
  )
}
