import axios from "axios";
import type {
  ApplicationDTO,
  ApplicationFilterDTO,
  ApplicationType,
  ApplicationView,
} from "../types/ApplicationType";

const BASE_URL = "http://localhost:8080/api/applications";
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
export const applicationApi = {
  getAll: async (jobPostId?: number): Promise<ApplicationType[]> => {
    const { data } = await api.get("by-job-post", { params: { jobPostId } });
    return data;
  },
  //TODO: This later
  //   getById: async (id: number): Promise<ApplicationType> => {
  //     const { data } = await api.get<ApplicationType>(`/${id}`);
  //     return data;
  //   }

  apply: async (applicationDTO: ApplicationDTO): Promise<ApplicationType> => {
    try {
      const { data } = await api.post("", applicationDTO);
      return data;
    } catch (err: any) {
      // Axios error handling
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message || "You have already applied to this job";
        // Throw a new error with a typed message
        throw new Error(message);
      }
      throw err; // rethrow unknown errors
    }
  },
  filter: async (
    filterDTO: ApplicationFilterDTO,
  ): Promise<ApplicationType[]> => {
    const { data } = await api.get("/filter", { params: filterDTO });
    return data;
  },

  getApplicantApplications: async (
    applicantId: number,
  ): Promise<ApplicationView[]> => {
    const { data } = await api.get(`/applicant/${applicantId}`);
    return data;
  },

  getAppliedJobIds: async (applicantId: number): Promise<number[]> => {
    const { data } = await api.get(`/applicant/${applicantId}/job-ids`);
    return data;
  }
};
