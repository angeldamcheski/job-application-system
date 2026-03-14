import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/cv";

const api = axios.create({
  baseURL: API_BASE_URL,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const cvApi = {
  uploadCV: async (file: File, applicantId: number) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/upload/${applicantId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
  getUserCV: async (applicantId: number) => {
    const response = await api.get(`/user/${applicantId}`);
    return response.data;
  },
  downloadCvFile: async (cvId: number): Promise<Blob> => {
    const response = await api.get(`/download/${cvId}`, {
      responseType: "blob", // Important: tells axios to handle binary data
    });
    return response.data; // Returns the actual Blob data
  },
  getCvFileUrl: (cvId: number) => `${API_BASE_URL}/download/${cvId}`,
};
