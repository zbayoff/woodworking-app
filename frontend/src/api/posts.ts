import axios from "axios";
import { CategoryType } from "./categories";

export interface PostType {
  categories: CategoryType[];
  content: string;
  date_created: Date;
  date_modified: Date;
  description: string;
  id: number;
  title: string;
}

export const getPost = async (id: number): Promise<PostType> => {
  const res = await axios({
    method: "get",
    url: `/api/post/${id}`,
  });

  return res.data;
};

export const getPosts = async (): Promise<PostType[]> => {
  const res = await axios({
    method: "get",
    url: "/api/post",
  });

  return res.data;
};
