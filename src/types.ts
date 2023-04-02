import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from './server/api/root'

type RouterOutputs = inferRouterOutputs<AppRouter>
type allRecipesOutput = RouterOutputs["recipe"]["all"]

export type Recipe = allRecipesOutput[number]