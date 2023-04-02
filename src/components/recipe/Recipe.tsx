import { type Recipe } from "~/types";

type RecipeProps = {
  recipe: Recipe;
};

export function Recipe({ recipe }: RecipeProps) {
  const { title, ingredients } = recipe;

  return (
    <div className="flex flex-1 flex-col gap-2">
      <h3 className="text-xl font-bold">{title}</h3>
      {ingredients.map((ingredient, i) => {
        return (
          <div key={i} className="text-sm">
            {ingredient.title}
          </div>
        );
      })}
    </div>
  );
}
