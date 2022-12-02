// import React from 'react';

import { useLoaderData } from "react-router-dom";
import { PostType, getPost } from "../App";

export async function postLoader({ params }: any) {
  return getPost(params.postId);
}

const Post = () => {
  const post = useLoaderData() as PostType;

  console.log("Post post: ", post);

  return (
    <div>
      Post Page
      <p>Post Title: {post.title}</p>
      <p>Post Title: {post.category}</p>
    </div>
  );
};

export default Post;
