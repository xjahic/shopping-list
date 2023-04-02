import type { inferRouterOutputs } from '@trpc/server'
import { z } from 'zod'
import type { AppRouter } from './server/api/root'

type RouterOutputs = inferRouterOutputs<AppRouter>
type allRecipesOutput = RouterOutputs["recipe"]["all"]

export type Recipe = allRecipesOutput[number]

export const createRecipeInput = z.object({
    title: z.string({
        required_error: 'Recipe title is required',
    }).min(1, 'Give yout recipe a title').max(50),
    ingredients: z.array(z.string()).min(1, 'Add at least one ingredient')
})