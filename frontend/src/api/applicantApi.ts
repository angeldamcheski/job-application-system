import axios from "axios";
import type { ApplicationView } from "../types/ApplicationType"; // Reuse your existing types

const API_BASE_URL = "http://localhost:8080/api/applicants";

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

export const applicantApi = {
  updateApplicant: async (id: number, data: any) => {
    const response = await api.put(`/${id}`, data);
    return response.data;
  },
  uploadProfileImage: async (userId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      `/${userId}/upload-photo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data; // imageUrl
  },
};
