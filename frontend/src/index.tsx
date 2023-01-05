import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.scss";
import App, { categoriesLoader } from "./App";
import ErrorPage from "./ErrorPage";
import Post, { detailPostLoader } from "./containers/Post";
import NewPost, { newPostAction } from "./containers/NewPost";
import Category, { categoryLoader } from "./containers/Category";
import { EditPost, editPostAction } from "./containers/EditPost";
import { Home, postsLoader } from "./containers/Home";

export const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    // loader: postLoader(queryClient),

    loader: categoriesLoader(queryClient),
    children: [
      { path: "/", element: <Home />, loader: postsLoader(queryClient) },
      {
        path: "posts/:postId",
        element: <Post />,
        loader: detailPostLoader(queryClient),
      },
      {
        path: "posts/:postId/edit",
        element: <EditPost />,
        loader: detailPostLoader(queryClient),
        action: editPostAction(queryClient),
      },
      {
        path: "/new-post",
        element: <NewPost />,
        action: newPostAction(queryClient),
      },
      {
        path: "category/:categoryId",
        element: <Category />,
        loader: categoryLoader(queryClient),
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
