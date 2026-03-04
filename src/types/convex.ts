import type { api } from 'convex/_generated/api'
import type { FunctionArgs, FunctionReturnType } from 'convex/server'
import type { PublicSnapshot } from './reference'

export type SpiritListItem = PublicSnapshot['spirits'][number]

export type GameDoc = NonNullable<FunctionReturnType<typeof api.games.getGame>>
export type GameId = FunctionArgs<typeof api.games.getGame>['id']
export type GameList = FunctionReturnType<typeof api.games.listGames>
export type GameListItem = GameList[number]
export type GameCreateInput = FunctionArgs<typeof api.games.createGame>
export type GameUpdateInput = Omit<FunctionArgs<typeof api.games.updateGame>, 'id'>
export type GameImportInput = FunctionArgs<typeof api.games.importGames>['games'][number]
export type GameUpdatePatch = GameUpdateInput

export function asGameId(value: string): GameId {
  return value as GameId
}
