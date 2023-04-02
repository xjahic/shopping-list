import { useState } from "react";
import toast from "react-hot-toast";
import { createRecipeInput, type Recipe } from "~/types";
import { api } from "~/utils/api";
import { CiSquareRemove } from "react-icons/ci";

export function CreateRecipe() {
  const [newRecipeTitle, setNewRecipeTitle] = useState("");
  const [newRecipeIngredients, setNewRecipeIngredients] = useState([
    "",
    "",
    "",
  ]);

  const trpc = api.useContext();

  const { mutate } = api.recipe.create.useMutation({
    onMutate: async (newRecipe) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await trpc.recipe.all.cancel();

      // Snapshot the previous value
      const previousRecipes = trpc.recipe.all.getData();

      // Optimistically update to the new value
      trpc.recipe.all.setData(undefined, (prev) => {
        const optimisticRecipe: Recipe = {
          id: "optimistic-recipe-id",
          title: newRecipe.title,
          ingredients: newRecipe.ingredients.map((ingredient) => ({
            title: ingredient,
            id: "optimistic-ingredient-id",
            userId: "",
          })),
        };

        if (!prev) return [optimisticRecipe];
        return [...prev, optimisticRecipe];
      });

      // Clear input
      setNewRecipeTitle("");
      setNewRecipeIngredients(["", "", ""]);

      // Return a context object with the snapshotted value
      return { previousRecipes };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newRecipe, context) => {
      toast.error("An error occured when creating recipe");
      // Clear input
      setNewRecipeTitle("");
      setNewRecipeIngredients(["", "", ""]);
      if (!context) return;
      trpc.recipe.all.setData(undefined, () => context.previousRecipes);
    },
    // Always refetch after error or success:
    onSettled: async () => {
      console.log("SETTLED");
      await trpc.recipe.all.invalidate();
    },
  });

  const removeIngredient = (index: number) => {
    const newIngredients = newRecipeIngredients.filter((_, i) => i !== index);
    setNewRecipeIngredients(newIngredients);
  };

  return (
    <div className="grid min-w-[320px] grid-cols-1 gap-4 md:gap-8">
      <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white">
        <h3 className="text-xl font-bold">Your new recipe</h3>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const result = createRecipeInput.safeParse({
                title: newRecipeTitle,
                ingredients: newRecipeIngredients.filter((i) => i !== ""),
              });

              if (!result.success) {
                toast.error(
                  result.error.issues.map((i) => i.message).join("\n")
                );
                return;
              }

              mutate(result.data);
            }}
            className="flex flex-col gap-2"
          >
            <>
              <div className="flex items-center gap-4">
                <span>Title</span>
                <input
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Recipe title..."
                  type="text"
                  name="recipe-title"
                  id="recipe-title"
                  value={newRecipeTitle}
                  onChange={(e) => {
                    setNewRecipeTitle(e.target.value);
                  }}
                />
              </div>
              <span className="mt-2">Ingredients</span>
              {newRecipeIngredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="Ingredient..."
                    type="text"
                    name="recipe-ingredient"
                    id="recipe-ingredient"
                    value={ingredient}
                    onChange={(e) => {
                      const newIngredients = [...newRecipeIngredients];
                      newIngredients[index] = e.target.value;
                      setNewRecipeIngredients(newIngredients);
                    }}
                  />
                  <CiSquareRemove
                    className="h-16 w-16 cursor-pointer"
                    onClick={() => removeIngredient(index)}
                  />
                </div>
              ))}
              <button
                className="text-white-500 underline underline-offset-4 hover:text-slate-200"
                onClick={(e) => {
                  e.preventDefault();
                  setNewRecipeIngredients([...newRecipeIngredients, ""]);
                }}
              >
                Add ingredient
              </button>
              <button
                type="submit"
                className="mt-4 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
              >
                Create
              </button>
            </>
          </form>
        </div>
      </div>
    </div>
  );
}
