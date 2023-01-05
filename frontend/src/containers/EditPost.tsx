import axios from "axios";
import { Link, redirect, useLoaderData } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { PostType } from "../api/posts";
import { PostForm } from "./PostForm";

export const editPostAction =
  (queryClient: QueryClient) =>
  async ({ params, request }: any) => {
    const formData = Object.fromEntries(await request.formData());

    const newData = {
      ...formData,
      categories: formData.categories.split(",").map((category: any) => {
        return { name: category };
      }),
    };

    try {
      await axios.put(`/api/post/${params.postId}`, JSON.stringify(newData), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.log("error: ", e);
    }

    await queryClient.invalidateQueries(["getPost"]);
    await queryClient.invalidateQueries(["getPosts"]);
    await queryClient.invalidateQueries(["getCategoryKey"]);
    await queryClient.invalidateQueries(["getCategoriesKey"]);

    return redirect(`/posts/${params.postId}`);
  };

export const EditPost = () => {
  const post = useLoaderData() as PostType;
  return (
    <div>
      Edit Post
      <Link to={`/posts/${post.id}`}>Cancel</Link>
      <PostForm
        method="put"
        action={`/posts/${post.id}/edit`}
        selectedPost={post}
      />
    </div>
  );
};
