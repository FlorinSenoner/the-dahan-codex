/**
 * Normalize arbitrary text into a route-safe slug segment.
 * Matches backend spirit/aspect slug comparison semantics.
 */
export function toSlugSegment(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function toAspectSlug(aspectName: string): string {
  return toSlugSegment(aspectName)
}
