import React from 'react'
import type { JobPostType } from '../types/JobPostType'
import { Tag } from 'antd'

type JobPostProps = {
    job: JobPostType,
    selectedJobPost: JobPostType | null,
    onSelect: (job: JobPostType)=> void
}

const JobPost: React.FC<JobPostProps> = ({job, selectedJobPost, onSelect}) => {
    const tags: string[] = Array.isArray(job.jobTags)
    ? job.jobTags.flatMap(tagString => tagString.split(',').map(t => t.trim()))
    : [];
    console.log(tags)
  return (
    <div 
                key={job.id}
                onClick={() => onSelect(job)}
                className={`p-4 cursor-pointer border-b border-slate-50 transition-colors ${
                selectedJobPost?.id === job.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-slate-50'
                }`}
            >
                <h3 className="font-semibold text-slate-900 mb-1">{job.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-2">{job.shortDescription}</p>
                <div className="flex gap-1 flex-wrap">
                {tags.map(tag => (
                    <Tag key={tag} className="text-[10px] m-0">{tag}</Tag>
                ))}
                </div>
            </div>
)
}

export default JobPost