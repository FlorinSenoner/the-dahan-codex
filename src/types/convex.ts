import type { api } from 'convex/_generated/api'
import type { FunctionReturnType } from 'convex/server'

export type SpiritListItem = FunctionReturnType<typeof api.spirits.listSpirits>[number]
