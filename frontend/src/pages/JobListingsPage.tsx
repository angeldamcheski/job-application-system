import { useEffect, useState, lazy } from "react";
import type { JobPostType } from "../types/JobPostType";
import { jobApi } from "../api/jobApi";
import { Spin, Empty, Button, Modal, Form, Select, Input, Space } from "antd";
import JobPost from "../components/JobPost";
import JobPostDetails from "../components/JobPostDetails";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
const CreateJobPost = lazy(() => import("../components/CreateJobPost"));
const { Search } = Input;

const JobListingsPage = () => {
  const queryClient = useQueryClient();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [selectedJobPost, setSelectedJobPost] = useState<JobPostType | null>(
    null,
  );
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined,
  );
  const [selectedTags, setSelectedTags] = useState<string[] | undefined>(
    undefined,
  );
  const [searchTerm, setSearchTerm] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery<JobPostType[]>({
      queryKey: ["jobPosts", selectedStatus, selectedTags],
      queryFn: ({ pageParam }) =>
        jobApi.getAllInfinite({
          lastId: Number(pageParam) || undefined,
          size: 5,
          jobStatus: selectedStatus,
          jobTags: selectedTags,
        }),
      refetchOnWindowFocus: false,
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => {
        if (!lastPage || lastPage.length === 0) return undefined;
        return lastPage[lastPage.length - 1].id;
      },
    });
  const jobPosts = data?.pages.flat() || [];
  console.log("Data return", jobPosts, hasNextPage);
  useEffect(() => {
    const delayFn = setTimeout(() => {
      setSelectedTags(
        searchTerm ? searchTerm.split(",").map((t) => t.trim()) : undefined,
      );
    }, 600);
    return () => clearTimeout(delayFn);
  }, [searchTerm]);

  useEffect(() => {
    if (jobPosts.length > 0 && selectedJobPost === null) {
      setSelectedJobPost(jobPosts[0]);
    }
  }, [data]);

  const handleDeleteJob = async (id: number) => {
    try {
      await jobApi.delete(id);
      if (selectedJobPost?.id === id) {
        setSelectedJobPost(null);
      }
      queryClient.invalidateQueries({ queryKey: ["jobPosts"], exact: false });
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

      queryClient.invalidateQueries({ queryKey: ["jobPosts"], exact: false });
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
      console.log(updatedJob);

      queryClient.invalidateQueries({ queryKey: ["jobPosts"], exact: false });
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
              <Space direction="vertical" className="w-full p-3" size="small">
                <Select
                  placeholder="Filter by Status"
                  className="w-full"
                  allowClear
                  onChange={(val) => setSelectedStatus(val)}
                >
                  <Select.Option value="ACTIVE">Active</Select.Option>
                  <Select.Option value="INACTIVE">Inactive</Select.Option>
                </Select>

                <Search
                  placeholder="Search tags (e.g. Java, React)"
                  allowClear
                  onChange={(e) => setSearchTerm(e.target.value)}
                  loading={isFetching}
                />
              </Space>
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
              <div className="p-4 flex justify-center">
                {hasNextPage ? (
                  <Button
                    onClick={() => fetchNextPage()}
                    loading={isFetchingNextPage}
                    className="w-full"
                  >
                    Load More
                  </Button>
                ) : (
                  <span className="text-slate-400 text-xs">
                    All jobs loaded
                  </span>
                )}
              </div>
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
