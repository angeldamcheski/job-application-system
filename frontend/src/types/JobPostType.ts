export interface JobPostType {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  jobTags: string[];
  jobStatus: "ACTIVE" | "INACTIVE";
  creationDate: string;
  updateDate: string;

  applicationStartDate?: string;
  applicationEndDate?: string;
  maxApplications?: number;
  applicationCount?: number;
}

export interface JobApiResponse {
  data: JobPostType[];
  total: number;
}
