import type { api } from 'convex/_generated/api'
import type { FunctionArgs, FunctionReturnType } from 'convex/server'
import type { PublicSnapshot } from './reference'

export type SpiritListItem = PublicSnapshot['spirits'][number]

export type GameDoc = NonNullable<FunctionReturnType<typeof api.games.getGame>>
export type GameId = FunctionArgs<typeof api.games.getGame>['id']
export type CreateGameArgs = FunctionArgs<typeof api.games.createGame>
export type GameUpdatePatch = CreateGameArgs

export function asGameId(value: string): GameId {
  return value as GameId
}
