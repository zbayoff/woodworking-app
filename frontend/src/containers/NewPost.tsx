import axios from "axios";
import { redirect } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { PostForm } from "./PostForm";

export const newPostAction =
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
      const res = await axios.post(`/api/post`, JSON.stringify(newData), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      await queryClient.invalidateQueries(["getPost"]);
      await queryClient.invalidateQueries(["getCategoryKey"]);
      await queryClient.invalidateQueries(["getCategoriesKey"]);

      return redirect(`/posts/${res.data.id}`);
    } catch (e) {
      console.log("error: ", e);
    }
  };

const NewPost = () => {
  return <PostForm method="post" action="/new-post" />;
};

export default NewPost;
