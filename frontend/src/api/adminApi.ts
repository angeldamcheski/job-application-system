import axios from "axios";
import type { ApplicationFilterDTO, ApplicationType, ApplicationView } from "../types/ApplicationType"; // Reuse your existing types

const API_BASE_URL = "http://localhost:8080/api/admin";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token for Admin access
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminApi = {
  /**
   * Fetches a paginated list of applicants
   * @param page 0-indexed page number
   * @param size number of items per page
   */
  getApplicants: async (page: number, size: number) => {
    const { data } = await api.get("/users", {
      params: { page, size },
    });
    return data; // Returns Page<Applicant> object
  },

  /**
   * Fetches applications for a specific applicant ID
   */
  getUserApplications: async (userId: number): Promise<ApplicationView[]> => {
    const { data } = await api.get(`/users/${userId}/applications`);
    return data;
  },

  getAllApplications: async (): Promise<ApplicationView[]> => {
    const { data } = await api.get("/applications");
    return data;
  },

  updateApplicationStatus: async (applicationId: number, status: string) => {
    await api.patch(`/${applicationId}/status`, { status });
  },
  filter: async (
      filterDTO: ApplicationFilterDTO,
    ): Promise<ApplicationType[]> => {
      const { data } = await api.get("/applications/filter", { params: filterDTO });
      return data;
    },
};
