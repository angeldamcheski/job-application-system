import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Typography,
  Button,
  Drawer,
  Tag,
  Space,
  Avatar,
  Descriptions,
  Modal,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EyeOutlined,
  RightOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../api/adminApi";
import ApplicationKanban from "../components/ApplicationKanban";
import ApplicationDetailsAdmin from "../components/ApplicationDetailsAdmin";
import MetricCard from "../components/MetricCard";
import { getMetrics } from "../utils/getMetrics";
import { useNavigate } from "react-router";
import { Input } from "antd";
const { Title, Text } = Typography;
const statusColors: Record<string, string> = {
  SUBMITTED: "blue",
  IN_REVIEW: "orange",
  ACCEPTED: "green",
  REJECTED: "red",
};
const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [kanbanOpen, setKanbanOpen] = useState(false);
  const [emailFilter, setEmailFilter] = useState<string>("");
  const [innerEmailFilter, setInnerEmailFilter] = useState<string>("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [metricsOpened, setMetricsOpened] = useState<boolean>(false);
  const queryClient = useQueryClient();
  // 1. Fetch Users Page
  const { data: pageData, isLoading: isUsersLoading } = useQuery({
    queryKey: [
      "admin",
      "users",
      pagination.current,
      pagination.pageSize,
      innerEmailFilter,
    ],
    queryFn: () =>
      adminApi.getApplicants(
        pagination.current - 1,
        pagination.pageSize,
        innerEmailFilter,
      ),
  });

  // 2. Fetch User Applications (only when a user is selected)
  const { data: userApplications, isLoading: isAppsLoading } = useQuery({
    queryKey: ["admin", "user-apps", selectedUser?.id],
    queryFn: () => adminApi.getUserApplications(selectedUser?.id),
    enabled: !!selectedUser?.id,
  });
  const {
    data: applications,
    refetch: refetchApps,
    isFetching: isFiltering,
  } = useQuery({
    queryKey: ["admin", "applications", innerEmailFilter],
    queryFn: () => {
      if (emailFilter.trim()) {
        return adminApi.filter({ email: innerEmailFilter });
      }
      return adminApi.getAllApplications();
    },
  });

  const columns = [
    {
      title: "Applicant Name",
      key: "name",
      render: (_: any, record: any) => (
        <Space>
          <Avatar icon={<UserOutlined />} className="bg-blue-500" />
          <Text strong>{`${record.firstName} ${record.lastName}`}</Text>
        </Space>
      ),
      sorter: (a: any, b: any) =>
        `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`,
        ),
    },
    {
      title: "Email Address",
      dataIndex: "emailAddress",
      key: "email",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Button
          type="primary"
          ghost
          icon={<EyeOutlined />}
          onClick={() => setSelectedUser(record)}
        >
          View Applications
        </Button>
      ),
    },
  ];
  useEffect(() => {
    const timeout = setTimeout(() => {
      setInnerEmailFilter(emailFilter);
    }, 400);
    return () => clearTimeout(timeout);
  }, [emailFilter]);
  console.log("Email term, inner email term", emailFilter, innerEmailFilter);
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0!">
            Admin Management
          </Title>
          <Text type="secondary">
            Monitor registered applicants and their activity.
          </Text>
        </div>
        {/* <Button type="primary" onClick={() => setKanbanOpen(true)}>
          Manage Applications
        </Button> */}
        <Button
          type="primary"
          onClick={() => navigate("/admin/manage-applications")}
        >
          Manage Applications
        </Button>
      </header>

      <Card className="shadow-sm border-slate-100 rounded-xl">
        <div className="mb-4 flex justify-between items-center">
          <Text type="secondary">Search applicants by email</Text>

          <Input.Search
            placeholder="Search by email..."
            allowClear
            onSearch={(value) => setEmailFilter(value)}
            style={{ width: 300 }}
            loading={isUsersLoading}
          />
        </div>
        <Table
          columns={columns}
          dataSource={pageData?.content || []}
          loading={isUsersLoading}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pageData?.totalElements || 0,
            showSizeChanger: true,
            onChange: (page, size) =>
              setPagination({ current: page, pageSize: size }),
          }}
        />
      </Card>

      {/* User Detail Drawer */}
      <Drawer
        title={`${selectedUser?.firstName} ${selectedUser?.lastName}`}
        size={600}
        onClose={() => setSelectedUser(null)}
        open={!!selectedUser}
        destroyOnHidden
      >
        {selectedUser && (
          <div className="space-y-8 shadow-xl rounded-lg p-5">
            <Card
              className="rounded-xl shadow-sm p-4 space-y-4"
              style={{ marginBottom: 32 }}
            >
              {/* <Title level={4}>
                Metrics - {selectedUser?.firstName} {selectedUser?.lastName}
              </Title>
              <div className="grid grid-cols-2  gap-4">
                {getMetrics(userApplications).map((metric) => (
                  <MetricCard key={metric.label} {...metric} />
                ))}
              </div> */}
              <div className="flex items-baseline justify-between mb-4">
                <Title level={4} className="mb-0">
                  Metrics – {selectedUser?.firstName} {selectedUser?.lastName}
                </Title>
                <Button
                  type="default"
                  icon={metricsOpened ? <DownOutlined /> : <RightOutlined />}
                  onClick={() => setMetricsOpened((prev) => !prev)}
                  size="middle"
                ></Button>
              </div>

              {metricsOpened && (
                <div className="grid grid-cols-2 gap-4 ">
                  {getMetrics(userApplications).map((metric) => (
                    <MetricCard key={metric.label} {...metric} />
                  ))}
                </div>
              )}

              {!metricsOpened && getMetrics(userApplications).length === 0 && (
                <Text type="secondary">No metrics available yet.</Text>
              )}
            </Card>
            <div className="inset-shadow-sm/20 bg-neutral-200/20 p-3 rounded-xl ">
              <Descriptions
                title="Contact Information"
                bordered
                column={1}
                size="small"
              >
                <Descriptions.Item label="Full Name">{`${selectedUser.firstName} ${selectedUser.lastName}`}</Descriptions.Item>
                <Descriptions.Item label="Email">
                  <MailOutlined className="mr-2" />
                  {selectedUser.emailAddress}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  <PhoneOutlined className="mr-2" />
                  {selectedUser.phoneNumber || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </div>

            <div className="shadow-md rounded-xl mt-5 p-3 bg-slate-100/20 border border-neutral-300/40">
              <Title level={5}>
                Application History for {selectedUser?.firstName}{" "}
                {selectedUser?.lastName}
              </Title>
              <Table
                dataSource={userApplications || []}
                loading={isAppsLoading}
                rowKey="id"
                size="small"
                pagination={false}
                columns={[
                  {
                    title: "Job Title",
                    dataIndex: ["jobPost", "title"],
                    key: "job",
                    sorter: (a, b) =>
                      a.jobPost.title.localeCompare(b.jobPost.title),
                  },
                  {
                    title: "Date Applied",
                    dataIndex: "submittedDate",
                    key: "date",
                    render: (d) => new Date(d).toLocaleDateString(),
                    sorter: (a, b) =>
                      new Date(a.submittedDate).getTime() -
                      new Date(b.submittedDate).getTime(),
                  },
                  {
                    title: "Status",
                    key: "status",
                    render: (u) => (
                      <Tag
                        color={statusColors[u.applicationStatus] || "default"}
                      >
                        {u.applicationStatus}
                      </Tag>
                    ),
                    sorter: (a, b) =>
                      a.applicationStatus.localeCompare(b.applicationStatus),
                  },
                ]}
                onRow={(record) => ({
                  style: { cursor: "pointer" },
                  onClick: () => setSelectedApplication(record),
                })}
              />
            </div>
          </div>
        )}
      </Drawer>
      <Modal
        title="Manage application status"
        open={kanbanOpen}
        onCancel={() => setKanbanOpen(false)}
        footer={null}
        width={1200}
      >
        <ApplicationKanban
          applications={applications || []}
          refetch={refetchApps}
          onSearch={(val) => setEmailFilter(val)}
          loading={isFiltering}
        />
      </Modal>
      {selectedApplication && (
        <ApplicationDetailsAdmin
          application={selectedApplication}
          visible={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onStatusChange={(newStatus) => {
            adminApi
              .updateApplicationStatus(selectedApplication.id, newStatus)
              .then(() => {
                refetchApps(); // refresh table
                queryClient.invalidateQueries({
                  queryKey: ["admin", "applications"],
                });
                queryClient.invalidateQueries({
                  queryKey: ["admin", "user-apps", selectedUser?.id],
                });
                setSelectedApplication(null);
              });
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;
