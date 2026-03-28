export type User = {
  id: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  role: "ADMIN" | "APPLICANT";
  profileImageUrl?: string;
};
