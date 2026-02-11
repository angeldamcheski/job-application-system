import  { useEffect, useState } from 'react'
import type { JobPostType } from '../types/JobPostType'
import { jobApi } from '../api/jobApi'
import { Spin, Empty } from 'antd'
import JobPost from '../components/JobPost'
import JobPostDetails from '../components/JobPostDetails'

const JobListingsPage = () => {
    const [jobPosts, setJobPosts] = useState<JobPostType[]>([])
    const [selectedJobPost, setSelectedJobPost] = useState<JobPostType | null>(null)
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        jobApi.getAll().then(data=>{setJobPosts(data)
            if(data.length>0) setSelectedJobPost(data[0])
                console.log(data)
        }).finally(()=>setLoading(false))
    }, [])
    if(loading)return <div className='flex justify-center items-center h-full'><Spin size='large' /></div>
    return (
    <div className="flex w-full h-[calc(100vh-64px)] overflow-hidden bg-white py-2">
        <div className='w-full max-w-250 mx-auto px-12  h-full'>
            <div className='flex h-full overflow-hidden border border-slate-200 rounded-xl shadow-lg'>
        {/* LEFT COLUMN: Job List */}
        <div className="w-1/3 h-full overflow-y-auto border-r border-slate-200 bg-white">
            <div className="p-4 bg-white sticky top-0 z-10 border-b border-slate-100">
            <h2 className="text-lg font-bold">Job Postings</h2>
            </div>
            
              {jobPosts.length === 0 ? (
    <div className="flex h-max items-center justify-center p-4">
      <Empty description="No job posts available" />
    </div>
  ) : (
    jobPosts.map((job) => (
      <JobPost
        key={job.id}
        job={job}
        selectedJobPost={selectedJobPost}
        onSelect={setSelectedJobPost}
      />
    ))
  )}
        </div>

      {/* RIGHT COLUMN: Job Details */}
        <div className="w-2/3 h-full overflow-y-auto bg-white">
            {selectedJobPost ? (
            <JobPostDetails selectedJobPost={selectedJobPost} onClose={() => setSelectedJobPost(null)}/>
            ) : (
            <div className="flex h-full items-center justify-center">
                <Empty description="Select a job to view details" />
            </div>
            )}
        </div>
            </div>
        </div>
      
      

    </div>
  )
}

export default JobListingsPage