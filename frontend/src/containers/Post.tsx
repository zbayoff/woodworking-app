import { Link, useLoaderData, useParams } from "react-router-dom";
import { format } from "date-fns";
import MDEditor from "@uiw/react-md-editor";

import { getPost, PostType } from "../api/posts";
import { useQuery } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";

const postDetailQuery = (id: any) => ({
  queryKey: ["getPost", id],
  queryFn: async () => getPost(id),
  staleTime: 1000 * 60 * 2,
});

export const detailPostLoader =
  (queryClient: QueryClient) =>
  async ({ params }: { params: any }): Promise<PostType> => {
    console.log("params: ", params);
    const query = postDetailQuery(params.postId);
    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery({ ...query }))
    );
  };

const Post = () => {
  const initialPostData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof detailPostLoader>>
  >;

  const params = useParams();

  const { data: post } = useQuery({
    ...postDetailQuery(params.postId),
    initialData: initialPostData,
  });

  const formattedDate = format(new Date(post.date_created), "MMM dd, yyyy");

  return (
    <div>
      <Link to={`/posts/${post.id}/edit`}>Edit</Link>
      <>
        <h1 className="font-semibold text-4xl capitalize mb-2">{post.title}</h1>
        <p className="text-sm uppercase">
          {post.categories.map((category) => (
            <Link to={`/category/${category.id}`} key={category.id}>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200 uppercase last:mr-0 mr-1">
                {category.name}
              </span>
            </Link>
          ))}
        </p>
        <p className="text-sm mb-4">{formattedDate}</p>
        <div className="bg-gray-100">
          <MDEditor.Markdown source={post.content} className="bg-inherit" />
        </div>
      </>
    </div>
  );
};

export default Post;
