import React, { useState } from "react";
import type { JobPostType } from "../types/JobPostType";
import { Button, Divider, Tag, Empty, Modal, Form } from "antd";
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import EditJobPost from "./EditJobPost";

type JobPostDetailsProp = {
  selectedJobPost: JobPostType | null;
  onClose: () => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, updatedJob: Partial<JobPostType>) => void;
};

const JobPostDetails: React.FC<JobPostDetailsProp> = ({
  selectedJobPost,
  onClose,
  onDelete,
  onEdit,
}) => {
  if (!selectedJobPost) {
    return (
      <div className="flex h-full items-center justify-center">
        <Empty description="Select a job to view details" />
      </div>
    );
  }
  const { confirm } = Modal;
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const tags: string[] = Array.isArray(selectedJobPost.jobTags)
    ? selectedJobPost.jobTags.flatMap((t) =>
        t.split(",").map((tag) => tag.trim()),
      )
    : [];
  const handleDelete = () => {
    if (!selectedJobPost) return;

    confirm({
      title: "Are you sure you want to delete this job post?",
      content: `Job: ${selectedJobPost.title}`,
      okText: "Yes, delete",
      type: "error",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        onDelete(selectedJobPost.id);
      },
      onCancel() {
        // do nothing
      },
    });
  };
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <CloseOutlined
          onClick={onClose}
          className="relative top-0 left-125 text-xl text-slate-400 hover:text-red-500 cursor-pointer p-2 rounded-full hover:bg-slate-100 transition-all"
        />
        <EditOutlined
          onClick={() => setEditing(true)}
          className="relative top-39 left-117 cursor-pointer rounded-full p-2 hover:bg-slate-100 transition-all"
        />
        <Modal
          title="Edit Job Post"
          open={editing}
          onCancel={() => setEditing(false)}
          onOk={async () => {
            try {
              const values = await form.validateFields();
              onEdit(selectedJobPost.id, {
                ...values,
                jobTags: values.jobTags
                  ? values.jobTags.split(",").map((tag: string) => tag.trim())
                  : [],
              });
              setEditing(false);
            } catch (err) {
              console.error(err);
            }
          }}
          okText="Save"
        >
          <EditJobPost
            form={form}
            initialValues={{
              title: selectedJobPost.title,
              shortDescription: selectedJobPost.shortDescription,
              fullDescription: selectedJobPost.fullDescription,
              jobTags: selectedJobPost.jobTags.join(", "),
              jobStatus: selectedJobPost.jobStatus as JobStatus,
            }}
          />
        </Modal>
        <h1 className="text-3xl font-bold text-slate-900">
          {selectedJobPost.title}
        </h1>
        <h5 className="text-m font semibold text-slate-600">
          {selectedJobPost.shortDescription}
        </h5>
        <div className="flex items-center gap-4 mt-2 text-slate-500">
          <span>
            Posted on{" "}
            {new Date(selectedJobPost.creationDate).toLocaleDateString()}
          </span>

          <Tag
            color={selectedJobPost.jobStatus === "ACTIVE" ? "green" : "volcano"}
          >
            {selectedJobPost.jobStatus}
          </Tag>
        </div>
        <span className="text-slate-600 ">
          Last updated on{" "}
          {new Date(selectedJobPost.updateDate).toLocaleDateString()}
        </span>
        <div className="mt-6 flex gap-3">
          <Button type="primary" size="large" className="px-8">
            Apply Now
          </Button>
          <Button size="large">Save</Button>
          <Button size="large" danger type="default" onClick={handleDelete}>
            Delete
          </Button>
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
          {tags.map((tag) => (
            <Tag key={tag} color="blue" className="px-3 py-1 text-sm">
              {tag}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobPostDetails;
