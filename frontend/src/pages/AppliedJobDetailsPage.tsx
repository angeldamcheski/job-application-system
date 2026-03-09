import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Button,
  Tag,
  Typography,
  Space,
  Divider,
  Breadcrumb,
  Alert,
  Result,
} from "antd";
import {
  CalendarOutlined,
  TagOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { jobApi } from "../api/jobApi";

const { Title, Paragraph, Text } = Typography;

const AppliedJobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: job,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: () => jobApi.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="max-w-4xl mx-auto p-10">
        <Card loading={true} />
      </div>
    );

  if (isError || !job)
    return (
      <Result
        status="404"
        title="Job Not Found"
        subTitle="The job post you are looking for does not exist or has been removed."
        extra={
          <Button type="primary" onClick={() => navigate("/profile")}>
            Back to Profile
          </Button>
        }
      />
    );

  return (
    <div className="max-w-5xl mx-auto p-6 animate-fadeIn">
      {/* Navigation */}
      <Breadcrumb className="mb-6" style={{ marginBottom: 6 }}>
        <Breadcrumb.Item
          className="cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          My Profile
        </Breadcrumb.Item>
        <Breadcrumb.Item>Application Review</Breadcrumb.Item>
      </Breadcrumb>

      {/* Success Banner */}
      <Alert
        title="You have already applied for this position"
        description={`Your application was received. You can review the job details below.`}
        type="success"
        showIcon
        closable
        icon={<CheckCircleOutlined />}
        className="mb-6 rounded-lg shadow-sm"
        style={{ marginBottom: 10 }}
      />

      <Card className="shadow-lg border-slate-100 rounded-xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Title level={2} className="m-0 text-slate-800!">
              {job.title}
            </Title>
            <Text className="text-lg text-slate-500">
              {job.shortDescription}
            </Text>
          </div>
          <div className="flex items-center gap-3">
            <Tag color="blue" className="m-0 px-3 py-1 font-medium">
              Applied
            </Tag>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center inset-shadow-sm">
            <CalendarOutlined className="text-blue-500 mb-2 text-xl" />
            <div className="text-xs uppercase text-slate-400 font-bold">
              Posted On
            </div>
            <div className="font-semibold">
              {new Date(job.creationDate).toLocaleDateString()}
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center md:col-span-2 inset-shadow-sm">
            <TagOutlined className="text-blue-500 mb-2 text-xl" />
            <div className="text-xs uppercase text-slate-400 font-bold mb-2">
              Required Skills
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {job.jobTags?.map((tag) => (
                <Tag
                  key={tag}
                  className="bg-white border-slate-200 text-slate-600 rounded-full"
                >
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        </div>

        <Divider className="my-8" />

        <div className="prose prose-slate max-w-none">
          <Title level={4} className="text-slate-700">
            Detailed Job Description
          </Title>
          <Paragraph className="text-slate-600 text-base leading-7 whitespace-pre-wrap">
            {job.fullDescription}
          </Paragraph>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex justify-center">
          <Button
            size="large"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/profile")}
            className="rounded-lg hover:border-blue-500 hover:text-blue-500"
          >
            Back to My Applications
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AppliedJobDetailsPage;
