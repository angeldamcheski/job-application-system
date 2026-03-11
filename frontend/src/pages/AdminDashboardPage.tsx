import React, { useState } from "react";
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
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../api/adminApi";
import ApplicationKanban from "../components/ApplicationKanban";
const { Title, Text } = Typography;
const statusColors: Record<string, string> = {
  SUBMITTED: "blue",
  IN_REVIEW: "orange",
  ACCEPTED: "green",
  REJECTED: "red",
};
const AdminDashboardPage: React.FC = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [kanbanOpen, setKanbanOpen] = useState(false);
  // 1. Fetch Users Page
  const { data: pageData, isLoading: isUsersLoading } = useQuery({
    queryKey: ["admin", "users", pagination.current, pagination.pageSize],
    queryFn: () =>
      adminApi.getApplicants(pagination.current - 1, pagination.pageSize),
  });

  // 2. Fetch User Applications (only when a user is selected)
  const { data: userApplications, isLoading: isAppsLoading } = useQuery({
    queryKey: ["admin", "user-apps", selectedUser?.id],
    queryFn: () => adminApi.getUserApplications(selectedUser?.id),
    enabled: !!selectedUser?.id,
  });
  const { data: applications, refetch: refetchApps } = useQuery({
    queryKey: ["admin", "applications"],
    queryFn: adminApi.getAllApplications,
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
        <Button type="primary" onClick={() => setKanbanOpen(true)}>
          Manage Applications
        </Button>
      </header>

      <Card className="shadow-sm border-slate-100 rounded-xl">
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
        title="Applicant Profile & Applications"
        width={600}
        onClose={() => setSelectedUser(null)}
        open={!!selectedUser}
        destroyOnClose // Ensures fresh data for each user
      >
        {selectedUser && (
          <div className="space-y-8">
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

            <div>
              <Title level={4}>Application History</Title>
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
                  },
                  {
                    title: "Date Applied",
                    dataIndex: "submittedDate",
                    key: "date",
                    render: (d) => new Date(d).toLocaleDateString(),
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
                  },
                ]}
              />
            </div>
          </div>
        )}
      </Drawer>
      <Modal
        title="Application Workflow"
        open={kanbanOpen}
        onCancel={() => setKanbanOpen(false)}
        footer={null}
        width={1200}
      >
        <ApplicationKanban
          applications={applications || []}
          refetch={refetchApps}
        />
      </Modal>
    </div>
  );
};

export default AdminDashboardPage;
