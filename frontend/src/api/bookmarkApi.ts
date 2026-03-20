import axios from "axios";
import type { BookmarkType } from "../types/BookmarkType";

const BASE_URL = "http://localhost:8080/api/bookmarks";
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
//TODO: make this service from the backendt
export const bookmarkApi = {
  listBookmarks: async (userId: number): Promise<number[]> => {
    const { data } = await api.get(`/${userId}/get`);
    return data;
  },
  saveJob: async (userId: number, jobId: number): Promise<void> => {
    const response = await api.post("/save", null, {
      params: { applicantId: userId, jobPostId: jobId },
    });
    const data = response.data;
    return data;
  },
  unsaveJob: async (userId: number, jobId: number): Promise<void> => {
    const response = await api.delete("/delete", {
      params: { applicantId: userId, jobPostId: jobId },
    });
    const data = response.data;
    return data;
  },
  listBookmarksDTO: async (userId: number): Promise<BookmarkType[]> => {
    const { data } = await api.get(`/${userId}/saved`);
    return data;
  },
};
