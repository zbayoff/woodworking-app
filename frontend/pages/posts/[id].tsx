import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { Post as PostType } from "../../types";
import Link from "next/link";

// pages/posts/[id].js

interface PostProps {
  fallbackPost: PostType;
}

// Generates routes based on posts categories `/posts/{category}/{post.id}}`
export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${process.env.HOST_URL}/api/post`);
  const posts = await res.json();

  const paths = posts.map((post: PostType) => {
    return { params: { id: String(post.id) } };
  });

  return {
    paths,
    fallback: "blocking", // can also be true or 'blocking'
  };
};

// `getStaticPaths` requires using `getStaticProps`

// This function gets called at build time
export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id;
  // Call an external API endpoint to get posts
  const res = await fetch(`${process.env.HOST_URL}/api/post/${id}`);
  // console.log("res: ", res);
  if (res.status === 404) {
    return {
      notFound: true,
      // revalidate: 1,
    };
  }
  const post = await res.json();

  // By returning { props: { post } }, the Post component
  // will receive `post` as a prop at build time
  return {
    props: {
      fallbackPost: post,
    },
    // revalidate: 1,
  };
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const id = context.params?.id;
//   // Call an external API endpoint to get posts
//   const res = await fetch(`${process.env.HOST_URL}/api/post/${id}`);
//   const post = await res.json();

//   // By returning { props: { post } }, the Post component
//   // will receive `post` as a prop at build time
//   return {
//     props: {
//       post,
//     },
//   };
// };

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export default function Post({ fallbackPost }: PostProps) {
  const { data, error, mutate } = useSWR(
    "/api/post/" + fallbackPost.id,
    fetcher,
    {
      fallbackData: fallbackPost,
      revalidateOnMount: false,
    }
  );

  // console.log("data: ", data);
  // console.log("error: ", error);

  const post = !error && data;
  // console.log("post: ", post);

  const [title, setTitle] = useState(post.title);

  const revalidate = () => {
    // update the post page
    fetch("/api/revalidate", {
      method: "POST",
      body: JSON.stringify({
        path: `/posts/${post.id}`,
      }),
    });

    // update the home page navbar
    fetch("/api/revalidate", {
      method: "POST",
      body: JSON.stringify({
        path: `/`,
      }),
    });
  };
  // Render post...
  //   console.log("post: ", post);
  const router = useRouter();

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const onSubmitHandler = async () => {
    // post to backend PUT

    const newObject: PostType = {
      ...data,
      title: title,
    };

    const res = await axios({
      url: `/api/post/${post.id}`,
      data: newObject,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("res: ", res.data);

    revalidate();

    mutate({ ...newObject }, { revalidate: false });
  };

  return (
    <div>
      <Link href={`/`}>Home</Link>
      single post page {post.title}
      <br />
      Category: {post.category}
      <br />
      Edit Title: <input value={title} onChange={onChangeHandler} />
      <br />
      <button onClick={onSubmitHandler}>Save</button>
      {/* <button onClick={() => revalidate()}>Revalidate</button> */}
    </div>
  );
}
