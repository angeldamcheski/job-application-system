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
  Tabs,
  Badge,
} from "antd";
import { data, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { EditOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import { applicationApi } from "../api/applicationApi";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicantApi } from "../api/applicantApi";
import { cvApi } from "../api/cvApi";
import { bookmarkApi } from "../api/bookmarkApi";
import type { BookmarkType } from "../types/BookmarkType";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [isViewingCv, setIsViewingCv] = useState(false);
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [form] = Form.useForm();
  const handleViewCv = async () => {
    if (!cvData?.id) return;

    try {
      setIsViewingCv(true);
      const blob = await cvApi.downloadCvFile(cvData.id);
      const url = URL.createObjectURL(blob);
      console.log("BLOB DATA", blob);

      setCvUrl(url);
      setCvModalOpen(true);
    } catch (error) {
      message.error("Failed to load CV file");
      console.error(error);
    } finally {
      setIsViewingCv(false);
    }
  };
  const handleCloseCvModal = () => {
    setCvModalOpen(false);
    if (cvUrl) {
      URL.revokeObjectURL(cvUrl);
      setCvUrl(null);
    }
  };
  const { data: bookmarks = [], isLoading: bookmarksLoading } = useQuery({
    queryKey: ["bookmarks", user?.id],
    queryFn: () => bookmarkApi.listBookmarksDTO(user!.id),
    enabled: !!user?.id,
  });
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
  const {
    data: cvData,
    isLoading: cvLoading,
    isError: cvError,
  } = useQuery({
    queryKey: ["cv", user?.id],
    queryFn: () => cvApi.getUserCV(user?.id),
    enabled: !!user?.id,
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
      sorter: (a, b) =>
        new Date(a.submittedDate).getTime() -
        new Date(b.submittedDate).getTime(),
      defaultSortOrder: "descend",
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
  const bookmarksColumns = [
    {
      title: "Job Title",
      dataIndex: "jobTitle",
      key: "jobTitle",
    },
    {
      title: "Saved On",
      dataIndex: "savedOn",
      key: "savedOn",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: BookmarkType, b: BookmarkType) =>
        new Date(a.savedOn).getTime() - new Date(b.savedOn).getTime(),
      defaultSortOrder: "descend",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: BookmarkType) => (
        <Button
          type="link"
          onClick={() => navigate(`/profile/saved/${record.jobPostId}`)}
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
        className="inset-shadow-sm/20! border! border-neutral-800 bg-neutral-200/20! hover:bg-neutral-200/40! rounded-xl! p-6 mb-6  transition-all! duration-300!"
        style={{ marginBottom: 20 }}
      >
        <div className="flex items-center justify-between space-x-4">
          <div className="shrink-0 bg-blue-100/20 border border-slate-400 p-5 rounded-full flex items-center justify-center">
            <UserOutlined className="text-3xl text-blue-500" />
          </div>

          {/* User Info */}
          <div className="flex-1">
            <Title level={3} className="m-0! text-slate-900!">
              {user?.firstName} {user?.lastName}
            </Title>
            <Text className="text-slate-500!">{user?.emailAddress}</Text>
          </div>
          <Space>
            {/* Edit Button */}
            <Button
              type="primary"
              onClick={() => {
                form.setFieldsValue(user);
                setEditOpen(true);
              }}
              icon={<EditOutlined />}
              className="flex! items-center! gap-1!"
            >
              Edit Profile
            </Button>
            {cvData && (
              <Button icon={<EyeOutlined />} onClick={handleViewCv}>
                View CV
              </Button>
            )}
          </Space>
        </div>
      </Card>
      {/* Applications Table */}
      {/* <Card
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
      </Card> */}
      <Tabs
        defaultActiveKey="applications"
        title="My applications"
        items={[
          {
            key: "applications",
            label: "My Applications",
            children: (
              <Table
                dataSource={applications || []}
                columns={columns}
                rowKey={(record) => record.id}
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: "You haven't applied to any jobs yet." }}
              />
            ),
          },
          {
            key: "bookmarks",
            label: (
              <Badge count={bookmarks.length} offset={[7, 0]} size="small">
                <span>Saved Jobs</span>
              </Badge>
            ),
            children: (
              <Table
                dataSource={bookmarks}
                columns={bookmarksColumns}
                rowKey={(record) => record.jobPostId}
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: "You haven't saved any jobs yet." }}
              />
            ),
          },
        ]}
      />
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
      <Modal
        title="My CV"
        open={cvModalOpen}
        footer={[
          <Button key="close" onClick={handleCloseCvModal}>
            Close
          </Button>,
          <Button
            key="download"
            type="primary"
            href={cvUrl || ""}
            download={`CV_${user?.lastName}.pdf`}
          >
            Download Copy
          </Button>,
        ]}
        onCancel={handleCloseCvModal}
        width={1000}
        centered
        bodyStyle={{ height: "75vh", padding: 0 }}
      >
        {cvUrl ? (
          <iframe
            src={`${cvUrl}#view=FitH`} // #view=FitH makes the PDF fit to width
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title="CV Viewer"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Text type="secondary">Loading document...</Text>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProfilePage;
