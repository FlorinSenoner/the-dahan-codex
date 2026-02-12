import { ConvexError } from 'convex/values'

/**
 * Validates that a string does not exceed the given max length.
 * Throws a ConvexError with a descriptive message if it does.
 */
export function validateStringLength(value: string | undefined, field: string, max: number) {
  if (value && value.length > max) {
    throw new ConvexError(`${field} must be ${max} characters or fewer`)
  }
}

/**
 * Validates a required string field.
 */
export function validateRequiredString(value: string, field: string, max: number) {
  if (value.trim().length === 0) {
    throw new ConvexError(`${field} is required`)
  }
  validateStringLength(value, field, max)
}

/**
 * Validates an optional integer range.
 */
export function validateIntegerRange(
  value: number | undefined,
  field: string,
  min: number,
  max: number,
) {
  if (value === undefined) return
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new ConvexError(`${field} must be an integer between ${min} and ${max}`)
  }
}

/**
 * Validates an optional HTTP/HTTPS URL and enforces reasonable length limits.
 */
export function validateHttpUrl(value: string | undefined, field: string, max = 2048) {
  if (!value) return
  validateStringLength(value, field, max)
  try {
    const url = new URL(value)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new ConvexError(`${field} must use http or https`)
    }
  } catch {
    throw new ConvexError(`${field} must be a valid URL`)
  }
}
