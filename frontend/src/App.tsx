import React from "react";
// import {
//   useQuery,
//   useMutation,
//   useQueryClient,
//   QueryClient,
//   QueryClientProvider,
// } from "@tanstack/react-query";
import "./App.scss";
import axios from "axios";
import { Link, Outlet, useLoaderData } from "react-router-dom";

export interface PostType {
  category: string;
  content: string;
  date_created: Date;
  date_modified: Date;
  description: string;
  id: number;
  title: string;
}

export const getPost = async (id: number) => {
  const res = await axios({
    method: "get",
    url: `/api/post/${id}`,
  });

  return res.data as PostType[];
};

export const getPosts = async () => {
  const res = await axios({
    method: "get",
    url: "/api/post",
  });

  return res.data as PostType[];
};

export async function loader() {
  const posts = await getPosts();
  return { posts };
}

const contactQuery = () => ({
  queryKey: ["posts"],
  queryFn: async () => getPosts(),
});

export const getPostsLoader = (queryClient: any) => async () => {
  const query = contactQuery();
  // ⬇️ return data or fetch it
  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};

function App() {
  const { posts } = useLoaderData() as { posts: PostType[] };

  return (
    <div className="flex flex-row min-h-screen bg-gray-100 text-gray-800">
      <aside className="sidebar w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-indigo-500">
        <div className="sidebar-header flex items-center justify-center py-4">
          <div className="inline-flex">Header</div>
        </div>
        <div className="sidebar-content px-4 py-6">
          Posts
          <ul className="flex flex-col w-full">
            {posts.map((post) => {
              return (
                <li className="my-px" key={post.id}>
                  <Link
                    className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-700 bg-gray-100"
                    to={`posts/${post.id}`}
                  >
                    {post.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
      <main className="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
        <header className="header bg-white shadow py-4 px-4">
          <div className="header-content flex items-center flex-row">
            <div className="flex ml-auto">
              <a href="/" className="flex flex-row items-center">
                <img
                  alt="test"
                  src="https://pbs.twimg.com/profile_images/378800000298815220/b567757616f720812125bfbac395ff54_normal.png"
                  className="h-10 w-10 bg-gray-200 border rounded-full"
                />
                <span className="flex flex-col ml-2">
                  <span className="truncate w-20 font-semibold tracking-wide leading-none">
                    John Doe
                  </span>
                  <span className="truncate w-20 text-gray-500 text-xs leading-none mt-1">
                    Manager
                  </span>
                </span>
              </a>
            </div>
          </div>
        </header>
        <div className="main-content flex flex-col flex-grow p-4">
          <h1 className="font-bold text-2xl text-gray-700">Post Detail</h1>
          <Outlet />
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
}

export default App;
