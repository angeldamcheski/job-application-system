import type { JobPostType } from "../types/JobPostType";

const BASE_URL = "http://localhost:8080/api/jobposts";

export const jobApi = {
  getAll: async (): Promise<JobPostType[]> => {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("Jobs are not available now.");
    return response.json();
  },

  getById: async (id: number): Promise<JobPostType> => {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error("Job post not found.");

    return response.json();
  },
};
