export type LoginDTO = {
  emailAddress: string;
  password: string;
};

export type RegisterDTO = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
};

export type AuthResponse = {
  userId: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  role: "ADMIN" | "APPLICANT";
  token: string;
  profileImageUrl?: string;
};
