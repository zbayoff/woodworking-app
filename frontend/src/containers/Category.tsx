import { Link, useLoaderData, useParams } from "react-router-dom";
import { CategoryType, getCategory } from "../api/categories";
import { QueryClient, useQuery } from "@tanstack/react-query";

const categoryDetailQuery = (id: any) => ({
  queryKey: ["getCategoryKey", id],
  queryFn: async () => getCategory(id),
  staleTime: 1000 * 60 * 10,
});

export const categoryLoader =
  (queryClient: QueryClient) =>
  async ({ params }: { params: any }): Promise<CategoryType> => {
    const query = categoryDetailQuery(params.categoryId);
    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery({ ...query }))
    );
  };

const Category = () => {

  const initialCategoryData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof categoryLoader>>
  >;

  const params = useParams();

  const { data: category } = useQuery({
    ...categoryDetailQuery(params.categoryId),
    initialData: initialCategoryData,
  });

  // load category
  return (
    <div>
      <h1>Category: {category.name}</h1>
      Posts:
      {category.posts?.map((post) => {
        return (
          <div key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </div>
        );
      })}
    </div>
  );
};

export default Category;
