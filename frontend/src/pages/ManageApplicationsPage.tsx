import React, { useState } from "react";
import { Typography, message } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../api/adminApi";
import ApplicationKanban from "../components/ApplicationKanban";

const { Title } = Typography;

const ManageApplicationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [emailFilter, setEmailFilter] = useState<string>("");
  const [innerEmailFilter, setInnerEmailFilter] = useState<string>("");

  const { data: applications, isFetching } = useQuery({
    queryKey: ["admin", "applications", innerEmailFilter],
    queryFn: async () => {
      if (innerEmailFilter.trim()) {
        return adminApi.filter({ email: innerEmailFilter });
      }
      return adminApi.getAllApplications();
    },
  });

  const refetchApplications = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "applications"] });
  };

  // Debounce email filter input
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setInnerEmailFilter(emailFilter);
    }, 400);
    return () => clearTimeout(timeout);
  }, [emailFilter]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-center mb-6">
        <Title level={2} className="mb-0">
          Manage Applications
        </Title>
        <p className="text-gray-500">
          Drag and drop applications between statuses and search by email.
        </p>
      </header>

      <ApplicationKanban
        applications={applications || []}
        refetch={refetchApplications}
        onSearch={(val) => setEmailFilter(val)}
        loading={isFetching}
      />
    </div>
  );
};

export default ManageApplicationsPage;
