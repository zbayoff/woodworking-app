import { QueryClient, useQuery } from "@tanstack/react-query";
import { Link, useLoaderData } from "react-router-dom";
import { PostType, getPosts } from "../api/posts";

const postsQuery = () => ({
  queryKey: ["getPosts"],
  queryFn: async () => getPosts(),
  staleTime: 1000 * 60 * 2,
});

export const postsLoader =
  (queryClient: QueryClient) => async (): Promise<PostType[]> => {
    const query = postsQuery();
    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery({ ...query }))
    );
  };

export const Home = () => {
  const initialPostsData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof postsLoader>>
  >;

  const { data: posts } = useQuery({
    ...postsQuery(),
    initialData: initialPostsData,
  });

  return (
    <div>
      Home
      <div className="">
        {posts.map((post) => {
          return (
            <Link to={`posts/${post.id}`} key={post.id}>
              <div className="card m-1">{post.title}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
