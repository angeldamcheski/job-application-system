import axios from "axios";
import type { AuthResponse, LoginDTO, RegisterDTO } from "../types/AuthType";

const BASE_URL = "http://localhost:8080/api/auth";
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
export const authApi = {
  login: async (loginDto: LoginDTO): Promise<AuthResponse> => {
    const { data } = await api.post("/login", loginDto);
    return data;
  },
  register: async (registerDto: RegisterDTO): Promise<AuthResponse> => {
    const { data } = await api.post("/register", registerDto);
    return data;
  },
};
