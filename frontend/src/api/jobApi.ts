import type { JobPostType } from "../types/JobPostType";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/jobposts";
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
export const jobApi = {
  getAll: async (): Promise<JobPostType[]> => {
    const { data } = await api.get<JobPostType[]>("");
    return data;
  },
  getAllInfinite: async ({
    lastId,
    size = 10,
    jobStatus,
    jobTags,
  }: {
    lastId?: number;
    size?: number;
    jobStatus?: string;
    jobTags?: string[];
  }): Promise<JobPostType[]> => {
    const params = new URLSearchParams();
    if (lastId !== undefined) params.append("lastId", lastId.toString());
    params.append("size", size.toString());
    if (jobStatus) params.append("jobStatus", jobStatus);
    jobTags?.forEach((tag) => params.append("jobTags", tag));
    const { data } = await api.get<JobPostType[]>("", { params });
    return data;
  },
  getById: async (id: number): Promise<JobPostType> => {
    const { data } = await api.get<JobPostType>(`/${id}`);
    return data;
  },

  create: async (job: any): Promise<JobPostType> => {
    const { data } = await api.post("/create", job);
    return data;
  },
  edit: async (id: number, job: any): Promise<JobPostType> => {
    const { data } = await api.patch(`/${id}/edit`, job);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/${id}/delete`);
  },
};