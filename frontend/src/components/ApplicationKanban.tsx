import React, { useState } from "react";
import { Card, Tag, Typography, message } from "antd";
import { adminApi } from "../api/adminApi";
import { useQueryClient } from "@tanstack/react-query";
const { Title, Text } = Typography;

type Application = {
  id: number;
  applicationStatus: string;
  submittedDate: string;
  applicant: {
    firstName: string;
    lastName: string;
  };
  jobPost: {
    title: string;
  };
};

const statuses = ["SUBMITTED", "IN_REVIEW", "ACCEPTED", "REJECTED"];

interface Props {
  applications: Application[];
  refetch: () => void;
}

const statusColors: Record<string, string> = {
  SUBMITTED: "blue",
  IN_REVIEW: "orange",
  ACCEPTED: "green",
  REJECTED: "red",
};

const ApplicationKanban: React.FC<Props> = ({ applications, refetch }) => {
  const queryClient = useQueryClient();
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const handleDragStart = (id: number) => {
    setDraggedId(id);
  };

  const handleDrop = async (status: string) => {
    if (!draggedId) return;

    try {
      await adminApi.updateApplicationStatus(draggedId, status);
      message.success("Application status updated");
      queryClient.invalidateQueries({ queryKey: ["admin", "applications"] });

      // Refresh user drawer data
      queryClient.invalidateQueries({ queryKey: ["admin", "user-apps"] });
    } catch (e) {
      message.error("Failed to update status");
    }

    setDraggedId(null);
  };

  const grouped = statuses.reduce((acc: any, status) => {
    acc[status] = applications.filter(
      (app) => app.applicationStatus === status,
    );
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-4 gap-4">
      {statuses.map((status) => (
        <div
          key={status}
          className="bg-slate-50 rounded-lg p-3 min-h-100 "
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(status)}
        >
          <Title level={5}>{status}</Title>

          {grouped[status]?.map((app: Application) => (
            <Card
              key={app.id}
              draggable
              onDragStart={() => handleDragStart(app.id)}
              size="small"
              className="mb-2  cursor-move shadow-sm"
              style={{ marginBottom: 10 }}
            >
              <Text strong>
                {app.applicant.firstName} {app.applicant.lastName}
              </Text>

              <div>
                <Text type="secondary">{app.jobPost.title}</Text>
              </div>

              <div className="mt-2">
                <Tag color={statusColors[app.applicationStatus]}>
                  {app.applicationStatus}
                </Tag>
              </div>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ApplicationKanban;
