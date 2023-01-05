import "./App.scss";
import { Link, Outlet } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { CategoryType, getCategories } from "./api/categories";

const categoriesQuery = () => ({
  queryKey: ["getCategoriesKey"],
  queryFn: async () => getCategories(),
  staleTime: 1000 * 60 * 10,
});

export const categoriesLoader =
  (queryClient: QueryClient) => async (): Promise<CategoryType[]> => {
    // console.log('params: ', params)
    const query = categoriesQuery();
    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery({ ...query }))
    );
  };

const App = () => {
  // const { categories } = useLoaderData() as { categories: CategoryType[] };

  // const initialCategoriesData = useLoaderData() as Awaited<
  //   ReturnType<ReturnType<typeof categoriesLoader>>
  // >;

  // const { data: categories } = useQuery({
  //   ...categoriesQuery(),
  //   initialData: initialCategoriesData,
  // });

  return (
    <div className="flex flex-row min-h-screen">
      {/* <aside className="sidebar w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-white">
        <div className="sidebar-header flex items-center justify-center py-4">
          <div className="inline-flex">
            <Link className="" to={`/`}>
              Home
            </Link>
          </div>
        </div>
        <div className="sidebar-content px-4 py-6">
          <ul className="flex flex-col w-full">
            {categories.map((category) => {
              return category.posts?.length ? (
                <li className="my-px" key={category.id}>
                  <Link
                    className="flex flex-row items-center h-10 px-3"
                    to={`category/${category.id}`}
                  >
                    {category.name}
                  </Link>
                </li>
              ) : null;
            })}
          </ul>
        </div>
      </aside> */}
      <main className="main flex flex-col flex-grow transition-all duration-150 ease-in">
        <header className="header bg-white shadow py-4 px-4">
          <div className="header-content flex items-center flex-row">
            <div className="flex mr-auto">
              <Link to="/">Home</Link>
            </div>
            <div className="flex ml-auto">
              <Link to="/new-post">New Post</Link>
            </div>
          </div>
        </header>
        <div className="main-content flex flex-col flex-grow p-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-start-4 col-span-6 ...">
              <Outlet />
            </div>
          </div>
        </div>
        <footer className="footer px-4 py-6">
          <div className="footer-content">
            <p className="text-sm text-gray-600 text-center">
              © Brandname 2020. All rights reserved.{" "}
              <a href="https://twitter.com/iaminos">by iAmine</a>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
