export interface ApplicantType {
  id: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
}

export interface ApplicationType {
  id: number;
  jobPost: {
    id: number;
    title: string;
  };
  applicant: ApplicantType;
  submittedDate: string;
  preferredLanguage?: string;
}

export interface ApplicationApiResponse {
  data: ApplicationType[];
  total: number;
}
export interface ApplicationDTO {
  jobPostId: number;
  applicantId: number;
  preferredLanguage?: string;
}
export interface ApplicationFilterDTO {
  jobPostId?: number;
  applicantName?: string;
  email?: string;
  preferredLanguage?: string;
  submittedFrom?: string;
  submittedTo?: string;
}
