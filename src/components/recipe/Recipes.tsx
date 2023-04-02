import { type Recipe } from "~/types";
import { Recipe as RecipeView } from "./Recipe";

type RecipesProps = {
  recipes: Recipe[];
};

export function Recipes({ recipes }: RecipesProps) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="flex min-w-[150px] max-w-[200px] flex-col gap-4 rounded-xl bg-slate-800 p-4 text-white"
          >
            <RecipeView key={recipe.id} recipe={recipe} />
          </div>
        ))}
      </div>
    </div>
  );
}
