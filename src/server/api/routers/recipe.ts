import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const recipeRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ctx}) => {
    const recipes = await ctx.prisma.recipe.findMany({
      where: {
        userId: ctx.session.user.id
      },
      include: {
        ingredients: true
      }
    })
    return recipes.map(({ id, title, ingredients }) => ({ id, title, ingredients }))
  }),
})
