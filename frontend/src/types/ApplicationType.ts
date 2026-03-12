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
export interface JobPostSummary {
  id: number;
  title: string;
}

export interface ApplicationView {
  id: number;
  jobPost: JobPostSummary;
  submittedDate: string;
  applicationStatus: string;
  // status can be added here if you add it to your Backend DTO
}
