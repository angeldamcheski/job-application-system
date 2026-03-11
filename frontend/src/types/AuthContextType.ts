import type { LoginDTO, RegisterDTO } from "./AuthType";
import type { User } from "./UserType";

export type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (dto: LoginDTO) => Promise<void>;
  register: (dto: RegisterDTO) => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => void;
};
