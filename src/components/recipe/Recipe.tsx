import toast from "react-hot-toast";
import { CiSquareRemove } from "react-icons/ci";
import { type Recipe } from "~/types";
import { api } from "~/utils/api";

type RecipeProps = {
  recipe: Recipe;
};

export function Recipe({ recipe }: RecipeProps) {
  const { id, title, ingredients } = recipe;

  const trpc = api.useContext();

  const { mutate: deleteMutation } = api.recipe.delete.useMutation({
    onMutate: async (deleteId) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await trpc.recipe.all.cancel();

      // Snapshot the previous value
      const previousRecipes = trpc.recipe.all.getData();

      // Optimistically update to the new value
      trpc.recipe.all.setData(undefined, (prev) => {
        if (!prev) return previousRecipes;
        return prev.filter((recipe) => recipe.id !== deleteId);
      });

      // Return a context object with the snapshotted value
      return { previousRecipes };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, deleteId, context) => {
      toast.error("An error occured when deleting recipe");
      if (!context) return; // Clear input
      trpc.recipe.all.setData(undefined, () => context.previousRecipes);
    },
    // Always refetch after error or success:
    onSettled: async () => {
      console.log("SETTLED");
      await trpc.recipe.all.invalidate();
    },
  });

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
      <div className="mt-4 flex flex-1 items-end gap-2 self-end">
        <CiSquareRemove
          className="cursor-pointer text-2xl text-red-500"
          onClick={() => deleteMutation(id)}
        />
      </div>
    </div>
  );
}
