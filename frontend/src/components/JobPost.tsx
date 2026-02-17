import React from "react";
import type { JobPostType } from "../types/JobPostType";
import Tag from "antd/es/tag";

type JobPostProps = {
  job: JobPostType;
  selectedJobPost: JobPostType | null;
  onSelect: (job: JobPostType) => void;
};

const JobPost: React.FC<JobPostProps> = ({
  job,
  selectedJobPost,
  onSelect,
}) => {
  const tags: string[] = Array.isArray(job.jobTags)
    ? job.jobTags.flatMap((tagString) =>
        tagString.split(",").map((t) => t.trim()),
      )
    : [];
  return (
    <div
      key={job.id}
      onClick={() => onSelect(job)}
      className={`p-4 cursor-pointer border-b border-slate-50 transition-colors ${
        selectedJobPost?.id === job.id
          ? "bg-blue-50 border-l-4 border-l-blue-500"
          : "hover:bg-slate-50"
      } `}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-semibold text-slate-900 flex-1 mr-2">
          {job.title}
        </h3>

        <Tag
          color={job.jobStatus === "ACTIVE" ? "green" : "volcano"}
          className="mr-0"
        >
          {job.jobStatus}
        </Tag>
      </div>
      <p className="text-sm text-slate-500 line-clamp-2 mb-2">
        {job.shortDescription}
      </p>

      <div className="flex flex-wrap gap-1">
        {/* {tags.map((tag) => (
          <Tag key={tag} className="text-[10px] m-0">
            {tag}
          </Tag>
        ))} */}
        {tags.slice(0, 2).map((tag) => (
          <Tag key={tag} className="text-[10px] m-0">
            {tag}
          </Tag>
        ))}
        {tags.length > 2 && (
          <Tag className="text-[10px] m-0">+{tags.length - 2}</Tag>
        )}
      </div>
    </div>
  );
};

export default JobPost;
