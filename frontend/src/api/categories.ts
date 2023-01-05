import axios from "axios";
import { PostType } from "./posts";

export interface CategoryType {
  id?: number;
  name: string;
  posts?: PostType[]
}

export const getCategory = async (id: string) => {
  const res = await axios({
    method: "get",
    url: `/api/category/${id}`,
  });

  return res.data as CategoryType;
};

export const getCategories = async () => {
  const res = await axios({
    method: "get",
    url: `/api/category`,
  });

  return res.data as CategoryType[];
};
