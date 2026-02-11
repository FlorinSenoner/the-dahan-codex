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
