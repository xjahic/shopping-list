import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { createRecipeInput } from "~/types";

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

  create: protectedProcedure.input(createRecipeInput).mutation(async ({ ctx, input }) => {
    return ctx.prisma.recipe.create({
      data: {
        title: input.title,
        ingredients: { 
          create: input.ingredients.map(ingredient => ({ title: ingredient, user: {
          connect: {
            id: ctx.session.user.id
          }
        } }))
        },
        user: {
          connect: {
            id: ctx.session.user.id
          }
        }
      }
    })
  }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return ctx.prisma.recipe.delete({
      where: {
        id: input,
      }
    })
  }),
})
