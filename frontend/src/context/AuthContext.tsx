import { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextType } from "../types/AuthContextType";
import type { User } from "../types/UserType";
import type { AuthResponse, LoginDTO, RegisterDTO } from "../types/AuthType";
import { authApi } from "../api/authApi";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (dto: LoginDTO) => {
    const response: AuthResponse = await authApi.login(dto);
    const userData: User = {
      id: response.userId,
      firstName: response.firstName,
      lastName: response.lastName,
      emailAddress: response.emailAddress,
      role: response.role,
    };
    setUser(userData);
    setToken(response.token);

    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(userData));
    return { ...userData, token: response.token };
  };
  const register = async (dto: RegisterDTO) => {
    const response: AuthResponse = await authApi.register(dto);
    const userData: User = {
      id: response.userId,
      firstName: response.firstName,
      lastName: response.lastName,
      emailAddress: response.emailAddress,
      role: response.role,
    };
    setUser(userData);
    setToken(response.token);

    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(userData));
    return { ...userData, token: response.token };
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigation.navigate("/auth");
  };
  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
