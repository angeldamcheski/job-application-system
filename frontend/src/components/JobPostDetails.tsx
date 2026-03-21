import React, { useState, lazy } from "react";
import type { JobPostType } from "../types/JobPostType";
import {
  Button,
  Divider,
  Tag,
  Empty,
  Modal,
  Form,
  notification,
  Table,
} from "antd";
import CloseOutlined from "@ant-design/icons/CloseOutlined";
import EditOutlined from "@ant-design/icons/EditOutlined";
import { applicationApi } from "../api/applicationApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import ApplyJobModal from "./ApplyModal";
import { SaveFilled, SaveOutlined } from "@ant-design/icons";
import { bookmarkApi } from "../api/bookmarkApi";
import { formatJobDate, getTimeAgo } from "../utils/dateUtils";
const EditJobPost = lazy(() => import("./EditJobPost"));
type JobPostDetailsProp = {
  selectedJobPost: JobPostType | null;
  onClose: () => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, updatedJob: Partial<JobPostType>) => void;
};
const applicationColumns = [
  {
    title: "Applicant Name",
    dataIndex: ["applicant", "firstName"],
    key: "firstName",
    sorter: (a: any, b: any) =>
      a.applicant.firstName.localeCompare(b.applicant.firstName),
    render: (_: any, record: any) =>
      `${record.applicant.firstName} ${record.applicant.lastName}`,
  },
  {
    title: "Applicant Email",
    dataIndex: ["applicant", "emailAddress"],
    key: "emailAddress",
  },
  {
    title: "Submitted Date",
    dataIndex: "submittedDate",
    key: "submittedDate",
    render: (date: string) => new Date(date).toLocaleDateString(),
    sorter: (a: any, b: any) =>
      new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime(),
  },
];
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
  const queryClient = useQueryClient();
  const { confirm } = Modal;
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);
  const tags: string[] = Array.isArray(selectedJobPost.jobTags)
    ? selectedJobPost.jobTags.flatMap((t) =>
        t.split(",").map((tag) => tag.trim()),
      )
    : [];
  const {
    data: applications,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["applications", selectedJobPost.id],
    queryFn: () => applicationApi.getAll(selectedJobPost.id),
    enabled: false,
  });
  const { data: bookmarkedJobIds = [] } = useQuery({
    queryKey: ["bookmarks", user?.id],
    queryFn: () => bookmarkApi.listBookmarks(user!.id),
    enabled: !!user && user.role === "APPLICANT",
  });
  const { data: appliedJobIds = [] } = useQuery({
    queryKey: ["appliedJobs", user?.id],
    queryFn: () => applicationApi.getAppliedJobIds(user!.id),
    enabled: !!user && user.role === "APPLICANT", // Only fetch for logged-in applicants
  });
  const hasApplied = appliedJobIds.includes(selectedJobPost.id);
  const hasBookmark = bookmarkedJobIds.includes(selectedJobPost.id);
  console.log("Applications render", applications);
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

  const handleSaveJob = () => {
    if (!user) {
      notification.warning({
        message: "Not logged in",
        description: "Please log in to save this job",
      });
      return;
    }
    if (hasBookmark) {
      bookmarkApi
        .unsaveJob(user.id, selectedJobPost.id)
        .then(() => {
          notification.warning({
            message: "Job Unsaved",
            description: `You have removed ${selectedJobPost.title} from your saved jobs`,
          });
          queryClient.invalidateQueries({ queryKey: ["bookmarks", user.id] }); // Refresh bookmarks after unsaving
        })
        .catch((err) => {
          console.error("Failed to unsave job", err);
          notification.error({
            message: "Failed to unsave job",
            description: err.message,
          });
        });
    } else {
      bookmarkApi
        .saveJob(user.id, selectedJobPost.id)
        .then(() => {
          notification.success({
            message: "Job Saved",
            description: `You have saved ${selectedJobPost.title}`,
          });
          queryClient.invalidateQueries({ queryKey: ["bookmarks", user.id] });
        })
        .catch((err) => {
          console.error("Failed to save job", err);
          notification.error({
            message: "Failed to save job",
            description: err.message,
          });
        });
    }
  };
  const today = new Date();

  const startDate = selectedJobPost.applicationStartDate
    ? new Date(selectedJobPost.applicationStartDate)
    : null;

  const endDate = selectedJobPost.applicationEndDate
    ? new Date(selectedJobPost.applicationEndDate)
    : null;

  const isBeforeStart = startDate && today < startDate;
  const isAfterEnd = endDate && today > endDate;

  const isFull =
    selectedJobPost.maxApplications &&
    selectedJobPost.applicationCount !== undefined &&
    selectedJobPost.applicationCount >= selectedJobPost.maxApplications;

  const jobStatus = selectedJobPost.jobStatus;
  const isActive = jobStatus === "ACTIVE";
  const isDisabled =
    hasApplied ||
    isBeforeStart ||
    isAfterEnd ||
    isFull ||
    jobStatus !== "ACTIVE";
  const showClosedTag = isBeforeStart || isAfterEnd || isFull;
  return (
    <div className="p-8 max-w-3xl">
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-700">
        {selectedJobPost.applicationStartDate && !showClosedTag && isActive &&(
          <div className="px-3 py-1 bg-green-100/20 text-green-500/70 rounded-md font-medium shadow-sm">
            {formatJobDate(selectedJobPost.applicationStartDate, {
              prefixPast: "Opened",
              prefixFuture: "Opens in",
            })}
          </div>
        )}
        {(showClosedTag || !isActive) && (
          <div className="px-3 py-1 bg-red-100/20 text-red-500/70 rounded-md font-medium shadow-sm">
            No longer accepting applications
          </div>
        )}
        {selectedJobPost.applicationEndDate && !showClosedTag && isActive && (
          <div className="px-3 py-1 bg-red-100/20 text-red-500/70 rounded-md font-medium shadow-sm">
            {formatJobDate(selectedJobPost.applicationEndDate, {
              prefixPast: "Closed",
              prefixFuture: "Closes in",
            })}
          </div>
        )}

        {selectedJobPost.maxApplications && !showClosedTag && isActive && (
          <div className="px-3 py-1 bg-blue-100/20 text-blue-500/70 rounded-md font-medium shadow-sm">
            {selectedJobPost.applications?.length || 0}{" "}
            {selectedJobPost.applications?.length === 1
              ? "applicant"
              : "applicants"}{" "}
          </div>
        )}
      </div>

      <div className="mb-6">
        <CloseOutlined
          onClick={onClose}
          className="relative top-0 left-125 text-xl text-slate-400 hover:text-red-500 cursor-pointer p-2 rounded-full hover:bg-slate-100 transition-all"
        />
        {user?.role === "ADMIN" && (
          <EditOutlined
            onClick={() => setEditing(true)}
            className="relative top-39 left-117 cursor-pointer rounded-full p-2 hover:bg-slate-100 transition-all"
          />
        )}
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
              // jobTags: selectedJobPost.jobTags.join(", "),
              jobTags: (selectedJobPost.jobTags || []).join(", "),
              jobStatus: selectedJobPost.jobStatus,
            }}
          />
        </Modal>
        <h1 className="text-3xl font-normal tracking-tight text-slate-900">
          {selectedJobPost.title}
        </h1>
        <h5 className="text-base font semibold text-slate-600">
          {selectedJobPost.shortDescription}
        </h5>
        <div className="flex items-center gap-4 mt-2 text-slate-500">
          <span>
            Posted {getTimeAgo(selectedJobPost.creationDate)}
            {/* {new Date(selectedJobPost.creationDate).toLocaleDateString()} */}
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
          {user?.role === "APPLICANT" && (
            <Button
              type="primary"
              size="large"
              disabled={!!isDisabled}
              style={{
                opacity: hasApplied ? 0.5 : 1,
                cursor: hasApplied ? "not-allowed" : "pointer",
              }}
              className="px-8"
              // onClick={async () => {
              //   if (!selectedJobPost) return;
              //   if (!user) {
              //     notification.warning({
              //       message: "Not logged in",
              //       description: "Please log in to apply for this job",
              //     });
              //     return;
              //   }
              //   try {
              //     await applicationApi.apply({
              //       jobPostId: selectedJobPost.id,
              //       applicantId: user?.id,
              //     });
              //     notification.success({
              //       message: "Application submitted",
              //       description: `You have successfully applied for ${selectedJobPost.title}`,
              //     });
              //   } catch (err: any) {
              //     console.log("Failed to apply for job", err);
              //     notification.error({
              //       message: "Application failed",
              //       description: err.message,
              //     });
              //   }
              // }}
              onClick={() => {
                if (!user) {
                  notification.warning({
                    message: "Not logged in",
                    description: "Please log in to apply for this job",
                  });
                  return;
                }

                setShowAppModal(true);
              }}
            >
              {hasApplied ? "Applied" : "Apply Now"}
            </Button>
          )}

          {user?.role === "ADMIN" && (
            <Button
              size="large"
              onClick={async () => {
                setShowApplications(true);
                await refetch();
              }}
            >
              View Applications
            </Button>
          )}

          <Modal
            title={`Applications for ${selectedJobPost.title}`}
            open={showApplications}
            onCancel={() => setShowApplications(false)}
            footer={null}
            width={800}
          >
            <Table
              columns={applicationColumns}
              dataSource={applications}
              loading={isLoading}
              rowKey={(record) => record.id}
            />
          </Modal>
          {user?.role === "APPLICANT" && (
            <Button
              size="large"
              icon={hasBookmark ? <SaveFilled /> : <SaveOutlined />}
              onClick={handleSaveJob}
            >
              {hasBookmark ? "Saved" : "Save "}
            </Button>
          )}
          {user?.role === "ADMIN" && (
            <Button size="large" danger type="default" onClick={handleDelete}>
              Delete
            </Button>
          )}
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
            // <Tag key={tag} color="blue" className="px-3 py-1 text-sm">
            //   {tag}
            // </Tag>
            <div
              key={tag}
              className="inline-flex items-center px-3 py-1 bg-white border border-slate-200 
                         rounded-2xl text-sm text-slate-700 font-light tracking-tight
                         shadow-sm hover:border-slate-300 hover:shadow transition-all"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
      {user?.role === "APPLICANT" && (
        <ApplyJobModal
          open={showAppModal}
          onClose={() => setShowAppModal(false)}
          jobPostId={selectedJobPost.id}
          applicantId={user.id}
          userName={`${user.firstName} ${user.lastName}`}
          userEmail={user.emailAddress}
        />
      )}
    </div>
  );
};
export default JobPostDetails;
