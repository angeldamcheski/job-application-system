import { useEffect, useState } from "react";
import type { JobPostType } from "../types/JobPostType";
import { jobApi } from "../api/jobApi";
import { Spin, Empty, Button, Modal, Form } from "antd";
import JobPost from "../components/JobPost";
import JobPostDetails from "../components/JobPostDetails";
import CreateJobPost from "../components/CreateJobPost";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const JobListingsPage = () => {
  const queryClient = useQueryClient();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [selectedJobPost, setSelectedJobPost] = useState<JobPostType | null>(
    null,
  );

  const {
    data: jobPosts,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["jobPosts"],
    queryFn: jobApi.getAll,
    enabled: true,
    initialData: [],
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    setSelectedJobPost(jobPosts[0]);
  }, [jobPosts]);

  const handleDeleteJob = async (id: number) => {
    try {
      await jobApi.delete(id);
      refetch();
      if (selectedJobPost?.id === id) {
        setSelectedJobPost(null);
      }
    } catch (error) {
      console.log("Failed to delete job: " + error);
    }
  };

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const newJob = {
        ...values,
        jobTags: values.jobTags
          ? values.jobTags.split(",").map((tag: string) => tag.trim())
          : [],
        jobStatus: "ACTIVE",
        creationDate: new Date().toISOString().split("T")[0],
        updateDate: new Date().toISOString().split("T")[0],
      };

      console.log(newJob);
      const created = await jobApi.create(newJob);

      // setJobPosts((prev) => [...prev, created]);
      queryClient.setQueryData(["jobPosts"], (prev: JobPostType[]) => {
        // oldData is the previous cached data for this query
        // Return the updated data
        return [...prev, created];
      });
      setSelectedJobPost(created);

      form.resetFields();
      setOpen(false);
    } catch (error) {
      console.error("The job could not be created at this moment " + error);
    }
  };

  const handleEditJob = async (
    id: number,
    updatedJob: Partial<JobPostType>,
  ) => {
    try {
      const edited = await jobApi.edit(id, updatedJob);
      // setJobPosts((prev) => prev.map((job) => (job.id === id ? edited : job)));

      queryClient.setQueryData(["jobPosts"], (prev: JobPostType[]) => {
        // oldData is the previous cached data for this query
        // Return the updated data
        return prev.map((job) => (job.id === id ? edited : job));
      });
      if (selectedJobPost?.id === id) setSelectedJobPost(edited);
    } catch (err) {
      console.error("Failed to edit job", err);
    }
  };
  return (
    <Spin spinning={isFetching}>
      <div className="flex w-full h-[calc(100vh-64px)] overflow-hidden bg-white py-2">
        <Modal
          title="Post"
          open={open}
          onCancel={handleCancel}
          onOk={handleCreate}
          okText="Create"
        >
          <CreateJobPost form={form} />
        </Modal>
        <div className="w-full max-w-250 mx-auto px-12  h-full">
          <div className="flex h-full overflow-hidden border border-slate-200 rounded-xl shadow-lg">
            {/* LEFT COLUMN: Job List */}
            <div className="w-1/3 h-full overflow-y-auto border-r border-slate-200 bg-white">
              <div className="flex p-4 space-x-12 justify-center bg-white sticky top-0 z-10 border-b border-slate-100">
                <h2 className="text-lg font-bold">Job Postings</h2>
                <Button type="primary" size="medium" onClick={showModal}>
                  Post a job
                </Button>
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
                <JobPostDetails
                  key={selectedJobPost.id}
                  selectedJobPost={selectedJobPost}
                  onClose={() => setSelectedJobPost(null)}
                  onDelete={handleDeleteJob}
                  onEdit={handleEditJob}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Empty description="Select a job to view details" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default JobListingsPage;
