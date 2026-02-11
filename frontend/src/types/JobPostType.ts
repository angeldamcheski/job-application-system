export interface JobPostType {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  jobTags: string[];
  jobStatus: "ACTIVE" | "INACTIVE";
  creationDate: string;
  updateDate: string;
}

export interface JobApiResponse {
  data: JobPostType[];
  total: number;
}
