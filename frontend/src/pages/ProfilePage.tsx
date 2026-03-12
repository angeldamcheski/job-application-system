import {
  Card,
  Table,
  Tag,
  Button,
  Typography,
  Space,
  message,
  Form,
  Modal,
  Input,
} from "antd";
import { data, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { EditOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import { applicationApi } from "../api/applicationApi";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicantApi } from "../api/applicantApi";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [form] = Form.useForm();
  const {
    data: applications,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["applications", user?.id],
    queryFn: () => applicationApi.getApplicantApplications(user?.id),
    enabled: !!user?.id, // Only run the query if user.id exists
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
  const updateMutation = useMutation({
    mutationFn: (data: any) => applicantApi.updateApplicant(user?.id, data),

    onSuccess: (updatedUser) => {
      message.success("Profile updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["applications", user?.id],
      });
      updateUser(updatedUser);
      setEditOpen(false);
    },

    onError: () => {
      message.error("Failed to update profile");
    },
  });
  // Columns for the applications table
  const columns = [
    {
      title: "Job Title",
      dataIndex: ["jobPost", "title"],
      key: "title",
      render: (text) => (
        <span className="font-medium text-slate-700">{text}</span>
      ),
    },
    {
      title: "Applied On",
      dataIndex: "submittedDate",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() =>
            navigate(`/profile/applications/${record.jobPost.id}`, {
              state: { status: record.applicationStatus },
            })
          }
        >
          View Job
        </Button>
      ),
    },
  ];
  console.log("User data pfp", user?.lastName);
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Card
        className="inset-shadow-sm/20 border! border-neutral-800 bg-neutral-200/20! hover:bg-neutral-200/40! rounded-xl p-6 mb-6  transition-all duration-300"
        style={{ marginBottom: 20 }}
      >
        <div className="flex items-center justify-between space-x-4">
          <div className="shrink-0 bg-blue-100/20 border border-slate-400 p-5 rounded-full flex items-center justify-center">
            <UserOutlined className="text-3xl text-blue-500" />
          </div>

          {/* User Info */}
          <div className="flex-1">
            <Title level={3} className="m-0 text-slate-900">
              {user?.firstName} {user?.lastName}
            </Title>
            <Text className="text-slate-200">{user?.emailAddress}</Text>
          </div>

          {/* Edit Button */}
          <Button
            type="primary"
            onClick={() => {
              form.setFieldsValue(user);
              setEditOpen(true);
            }}
            icon={<EditOutlined />}
            className="flex items-center gap-1"
          >
            Edit Profile
          </Button>
        </div>
      </Card>
      {/* Applications Table */}
      <Card
        title={<span className="text-lg font-semibold">My Applications</span>}
        className="shadow-sm border-slate-100"
      >
        <Table
          dataSource={applications || []}
          columns={columns}
          rowKey={(record) => record.id}
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: "You haven't applied to any jobs yet." }}
        />
      </Card>
      <Modal
        title="Edit Profile"
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={updateMutation.isPending}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => updateMutation.mutate(values)}
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="emailAddress"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Phone Number" name="phoneNumber">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
