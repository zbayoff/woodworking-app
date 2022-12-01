import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";

import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { Post } from "../types";

export const getStaticProps: GetStaticProps = async (context) => {
  // Call an external API endpoint to get posts
  const res = await fetch(`${process.env.HOST_URL}/api/post`);
  // console.log("res: ", res);
  if (res.status === 404) {
    return {
      notFound: true,
      // revalidate: 1,
    };
  }
  const posts = await res.json();

  // By returning { props: { post } }, the Post component
  // will receive `post` as a prop at build time
  return {
    props: {
      posts,
    },
    // revalidate: 1,
  };
};

interface HomeProps {
  posts: Post[];
}

export default function Home({ posts }: HomeProps) {
  // console.log('posts: ', posts)

  const onSubmitHandler = async (event: any) => {
    event.preventDefault();
    console.log("e: ", event);
    console.log(event.target.elements.title.value);
    const data = {
      title: event.target.elements.title.value,
      description: event.target.elements.description.value,
      category: event.target.elements.category.value,
      content: event.target.elements.content.value,
    };

    console.log("JSON.stringify(data): ", JSON.stringify(data));

    // submit a post to server
    try {
      const res = await fetch(`/api/post`, {
        method: "POST",
        body: JSON.stringify(data),
        // mode: "same-origin",
        // credentials: "same-origin",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
      console.log("res: ", res);
    } catch (e) {
      console.log("error: ", e);
    }
  };

  const revalidate = () => {
    fetch("/api/revalidate", {
      method: "POST",
      body: JSON.stringify({
        path: `/`,
      }),
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Woodworking App</title>
        <meta name="description" content="Woodworking app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Woodworking App</h1>
        <div>Nav:</div>
        {posts.map((post) => {
          return (
            <div key={post.id}>
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </div>
          );
        })}
        Create new Post
        <form onSubmit={onSubmitHandler}>
          <input type={"text"} placeholder={"title"} name="title" />
          <input type={"text"} placeholder={"description"} name="description" />
          <input type={"text"} placeholder={"category"} name="category" />
          <input type={"text"} placeholder={"content"} name="content" />
          <input type={"submit"}></input>
        </form>
        <button onClick={() => revalidate()}>Revalidate</button>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
