import type { api } from 'convex/_generated/api'
import type { FunctionReturnType } from 'convex/server'

export type PublicSnapshot = FunctionReturnType<typeof api.reference.getPublicSnapshot>
export type PublicSpirit = PublicSnapshot['spirits'][number]
export type PublicOpening = PublicSnapshot['openings'][number]
export type PublicAdversary = PublicSnapshot['adversaries'][number]
