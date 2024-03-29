import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Recipes } from "~/components/recipe/Recipes";
import { CreateRecipe } from "~/components/recipe/CreateRecipe";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const {
    data: recipes,
    isLoading,
    isError,
  } = api.recipe.all.useQuery(undefined, { enabled: !!sessionData });

  if (sessionData && isLoading) return <div>Loading recipes</div>;
  if (sessionData && isError) return <div>Error fetching recipes</div>;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-slate-900">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {recipes && (
            <>
              <div className="grid grid-cols-1 gap-4 md:gap-8">
                <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white">
                  <h3 className="text-xl font-bold">Recipes</h3>
                  <Recipes recipes={recipes} />
                </div>
              </div>
            </>
          )}
          {sessionData && <CreateRecipe />}
          <div className="mt-12 flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-sm text-white">
                {sessionData && (
                  <span>Logged in as {sessionData.user?.email}</span>
                )}
              </p>
              <button
                className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
                onClick={
                  sessionData ? () => void signOut() : () => void signIn()
                }
              >
                {sessionData ? "Sign out" : "Sign in"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
