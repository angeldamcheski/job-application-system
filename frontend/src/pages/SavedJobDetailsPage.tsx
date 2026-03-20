import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { jobApi } from "../api/jobApi";
import { applicationApi } from "../api/applicationApi";
import { bookmarkApi } from "../api/bookmarkApi";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  Typography,
  Tag,
  Button,
  Divider,
  Empty,
  notification,
  Modal,
} from "antd";
import { ArrowLeftOutlined, SaveFilled, SaveOutlined } from "@ant-design/icons";
import ApplyJobModal from "../components/ApplyModal";

const { Title, Text } = Typography;

const SavedJobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Fetch job details
  const {
    data: job,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: () => jobApi.getById(Number(id)),
    enabled: !!id,
  });

  // Fetch applied jobs of current user
  const { data: appliedJobIds = [] } = useQuery({
    queryKey: ["appliedJobs", user?.id],
    queryFn: () => applicationApi.getAppliedJobIds(user!.id),
    enabled: !!user && user.role === "APPLICANT",
  });

  // Fetch bookmarks to check if saved
  const { data: bookmarkedJobIds = [] } = useQuery({
    queryKey: ["bookmarks", user?.id],
    queryFn: () => bookmarkApi.listBookmarks(user!.id),
    enabled: !!user && user.role === "APPLICANT",
  });

  const hasApplied = appliedJobIds.includes(Number(id));
  const hasBookmark = bookmarkedJobIds.includes(Number(id));

  // Save/Unsave job handler
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
        .unsaveJob(user.id, Number(id))
        .then(() => {
          notification.warning({
            message: "Job Unsaved",
            description: `You removed ${job?.title} from your saved jobs`,
          });
          queryClient.invalidateQueries({ queryKey: ["bookmarks", user.id] });
          navigate("/profile"); // optionally redirect to profile
        })
        .catch((err) => {
          notification.error({
            message: "Failed to unsave job",
            description: err.message,
          });
        });
    } else {
      bookmarkApi
        .saveJob(user.id, Number(id))
        .then(() => {
          notification.success({
            message: "Job Saved",
            description: `You saved ${job?.title}`,
          });
          queryClient.invalidateQueries({ queryKey: ["bookmarks", user.id] });
        })
        .catch((err) => {
          notification.error({
            message: "Failed to save job",
            description: err.message,
          });
        });
    }
  };

  if (isLoading)
    return (
      <div className="max-w-4xl mx-auto p-10">
        <Card loading />
      </div>
    );

  if (isError || !job)
    return (
      <Card className="max-w-4xl mx-auto p-10">
        <Empty description="Job not found or removed" />
        <Button
          type="primary"
          onClick={() => navigate("/profile")}
          className="mt-4"
        >
          Back to Profile
        </Button>
      </Card>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/profile")}
        className="mb-6"
      >
        Back to Profile
      </Button>

      <Card className="shadow-lg rounded-xl overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div>
            <Title level={2}>{job.title}</Title>
            <Text type="secondary">{job.shortDescription}</Text>
          </div>
          <div className="flex gap-2">
            {user?.role === "APPLICANT" && (
              <Button
                icon={hasBookmark ? <SaveFilled /> : <SaveOutlined />}
                onClick={handleSaveJob}
              >
                {hasBookmark ? "Saved" : "Save"}
              </Button>
            )}
          </div>
        </div>

        <Divider />

        <div className="prose prose-slate max-w-none">
          <h3>Job Description</h3>
          <p>{job.fullDescription}</p>
        </div>

        <div className="mt-6 flex gap-3">
          {user?.role === "APPLICANT" && (
            <Button
              type="primary"
              size="large"
              disabled={hasApplied}
              onClick={() => setShowApplyModal(true)}
            >
              {hasApplied ? "Already Applied" : "Apply Now"}
            </Button>
          )}
        </div>
      </Card>

      {/* Apply Job Modal */}
      {user && (
        <ApplyJobModal
          open={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          jobPostId={job.id}
          applicantId={user.id}
          userName={`${user.firstName} ${user.lastName}`}
          userEmail={user.emailAddress}
        />
      )}
    </div>
  );
};

export default SavedJobDetailsPage;
