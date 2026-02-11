import React from 'react'
import type { JobPostType } from '../types/JobPostType'
import { Button, Divider, Tag, Empty } from 'antd'
import {CloseOutlined} from '@ant-design/icons';
type JobPostDetailsProp = {
    selectedJobPost:JobPostType | null;
    onClose: ()=>void;
}

const JobPostDetails: React.FC<JobPostDetailsProp> = ({selectedJobPost, onClose}) => {
    if(!selectedJobPost){
         return (
      <div className="flex h-full items-center justify-center">
        <Empty description="Select a job to view details" />
      </div>
    )
    }

     const tags: string[] = Array.isArray(selectedJobPost.jobTags)
    ? selectedJobPost.jobTags.flatMap(t => t.split(',').map(tag => tag.trim()))
    : []

  return (
    <div className="p-8 max-w-3xl">
                <div className="mb-6">
                <CloseOutlined onClick={onClose} className="relative top-0 left-125 text-xl text-slate-400 hover:text-red-500 cursor-pointer p-2 rounded-full hover:bg-slate-100 transition-all"/>

                <h1 className="text-3xl font-bold text-slate-900">{selectedJobPost.title}</h1>
                <h5 className='text-m font semibold text-slate-600'>{selectedJobPost.shortDescription}</h5>
                <div className="flex items-center gap-4 mt-2 text-slate-500">
                    <span>Posted on {new Date(selectedJobPost.creationDate).toLocaleDateString()}</span>
                    <Tag color={selectedJobPost.jobStatus === 'ACTIVE' ? 'green' : 'volcano'}>
                    {selectedJobPost.jobStatus}
                    </Tag>
                </div>
                <div className="mt-6 flex gap-3">
                    <Button type="primary" size="large" className="px-8">Apply Now</Button>
                    <Button size="large">Save</Button>
                </div>
                </div>

                <Divider />

                <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-semibold mb-2">About the job</h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedJobPost.fullDescription}
                </p>
                </div>

                <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Skills</h3>
                <div className="flex gap-2 flex-wrap">
                    {tags.map(tag => (
                    <Tag key={tag} color="blue" className="px-3 py-1 text-sm">{tag}</Tag>
                    ))}
                </div>
                </div>
            </div>
  )
}

export default JobPostDetails