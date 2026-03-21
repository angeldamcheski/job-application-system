// import React from "react";
// import type { JobPostType } from "../types/JobPostType";
// import Tag from "antd/es/tag";

// type JobPostProps = {
//   job: JobPostType;
//   selectedJobPost: JobPostType | null;
//   onSelect: (job: JobPostType) => void;
//   appliedJobs?: number[]; // New prop to indicate which jobs the user has applied to
// };

// const JobPost: React.FC<JobPostProps> = ({
//   job,
//   selectedJobPost,
//   onSelect,
//   appliedJobs = [],
// }) => {
//   const isApplied = appliedJobs.includes(job.id);
//   const tags: string[] = Array.isArray(job.jobTags)
//     ? job.jobTags.flatMap((tagString) =>
//         tagString.split(",").map((t) => t.trim()),
//       )
//     : [];
//   return (
//     <div
//       key={job.id}
//       onClick={() => onSelect(job)}
//       className={`p-4 cursor-pointer border-b border-slate-50 transition-colors ${
//         selectedJobPost?.id === job.id
//           ? "bg-blue-50 border-l-4 border-l-blue-500"
//           : "hover:bg-slate-50"
//       } ${isApplied ? "opacity-70" : ""}`} // Dim the card if the user has applied
//     >
//       <div className="flex justify-between items-start mb-1">
//         <h3 className="font-semibold text-slate-900 flex-1 mr-2">
//           {job.title}
//         </h3>

//         <Tag
//           color={
//             isApplied              ? "blue"
//               : job.jobStatus === "ACTIVE"
//               ? "green"
//               : "volcano"
//           }
//           className="mr-0"
//         >
//           {isApplied ? "APPLIED" : job.jobStatus}
//         </Tag>
//       </div>
//       <p className="text-sm text-slate-500 line-clamp-2 mb-2">
//         {job.shortDescription}
//       </p>

//       <div className="flex flex-wrap gap-1">
//         {/* {tags.map((tag) => (
//           <Tag key={tag} className="text-[10px] m-0">
//             {tag}
//           </Tag>
//         ))} */}
//         {tags.slice(0, 2).map((tag) => (
//           <Tag key={tag} className="text-[10px] m-0">
//             {tag}
//           </Tag>
//         ))}
//         {tags.length > 2 && (
//           <Tag className="text-[10px] m-0">+{tags.length - 2}</Tag>
//         )}
//       </div>
//     </div>
//   );
// };

// export default JobPost;
import React from "react";
import type { JobPostType } from "../types/JobPostType";
import { Tag } from "antd";
import { CheckOutlined } from "@ant-design/icons";
type JobPostProps = {
  job: JobPostType;
  selectedJobPost: JobPostType | null;
  onSelect: (job: JobPostType) => void;
  appliedJobs?: number[];
};

const JobPost: React.FC<JobPostProps> = ({
  job,
  selectedJobPost,
  onSelect,
  appliedJobs = [],
}) => {
  const isSelected = selectedJobPost?.id === job.id;
  const isApplied = appliedJobs.includes(job.id);

  const tags: string[] = Array.isArray(job.jobTags)
    ? job.jobTags.flatMap((tagString) =>
        tagString.split(",").map((t) => t.trim()),
      )
    : [];

  const today = new Date();
  const startDate = job.applicationStartDate
    ? new Date(job.applicationStartDate)
    : null;
  const endDate = job.applicationEndDate
    ? new Date(job.applicationEndDate)
    : null;
  const isBeforeStart = startDate && today < startDate;
  const isAfterEnd = endDate && today > endDate;
  const isFull =
    job.maxApplications && job.applicationCount !== undefined
      ? job.applicationCount >= job.maxApplications
      : false;

  const isActive = job.jobStatus === "ACTIVE";
  const isDisabled = isApplied || isBeforeStart || isAfterEnd || isFull;
  const showClosedTag = isBeforeStart || isAfterEnd || isFull || !isActive;
  return (
    <div
      onClick={() => onSelect(job)}
      className={`group mx-2 my-1.5 px-5 py-5 rounded-2xl cursor-pointer border border-zinc-200/80 transition-all duration-200
        ${
          isSelected
            ? "bg-white shadow-lg shadow-blue-100 ring-1 ring-blue-200 border-none"
            : "hover:bg-white hover:shadow-md active:scale-[0.985] "
        }
        ${isApplied ? "opacity-75" : ""}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Title */}
        <h3
          className={`font-medium text-[15.5px] leading-tight tracking-[-0.01em] line-clamp-2 flex-1 min-w-0 overflow-hidden transition-colors
            ${isSelected ? "text-blue-700" : "text-slate-900 group-hover:text-slate-800"}`}
        >
          {job.title}
        </h3>

        {/* Status / Applied Badge */}
        <div className="shrink-0">
          {!showClosedTag && isApplied ? (
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-0.5 rounded-full text-xs font-medium">
              <CheckOutlined className="w-3.5 h-3.5" />
              Applied
            </div>
          ) : (
            !showClosedTag && (
              <Tag
                color={job.jobStatus === "ACTIVE" ? "green" : "red"}
                className="text-xs font-medium border-0 px-3 py-0.5 rounded-full"
              >
                {job.jobStatus}
              </Tag>
            )
          )}
        </div>
      </div>

      {/* Short Description */}
      <p className="mt-1  text-[13.5px] text-slate-500 line-clamp-2 leading-relaxed">
        {job.shortDescription}
      </p>

      {/* Tags */}
      {/* {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-block px-3 py-0.5 text-[10.5px] font-light bg-slate-100 text-slate-600 rounded-lg tracking-tight"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="inline-block px-3 py-0.5 text-[10.5px] font-light text-slate-400">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )} */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {showClosedTag ? (
          <span className="inline-block px-3 py-1 text-xs font-medium bg-red-50 text-red-500/70 rounded-md tracking-tight ">
            No longer accepting applications
          </span>
        ) : (
          <>
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-3 py-0.5 text-[10.5px] font-light bg-slate-100 text-slate-600 rounded-lg tracking-tight"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-block px-3 py-0.5 text-[10.5px] font-light text-slate-400">
                +{tags.length - 3}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobPost;
