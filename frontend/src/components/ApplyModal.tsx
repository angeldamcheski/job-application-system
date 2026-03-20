import React, { useEffect, useState } from "react";
import { Modal, Upload, Button, Typography, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { cvApi } from "../api/cvApi";
import { applicationApi } from "../api/applicationApi";
import { useQueryClient } from "@tanstack/react-query";

const { Text } = Typography;

type Props = {
  open: boolean;
  onClose: () => void;
  jobPostId: number;
  applicantId: number;
  userName: string;
  userEmail: string;
};

const ApplyJobModal: React.FC<Props> = ({
  open,
  onClose,
  jobPostId,
  applicantId,
  userName,
  userEmail,
}) => {
  const queryClient = useQueryClient();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [existingCv, setExistingCv] = useState<{
    fileName: string;
    id: number;
  } | null>(null);
  const handleSubmit = async () => {
    try {
      setUploading(true);

      if (fileList.length > 0) {
        const file = fileList[0].originFileObj as File;

        await cvApi.uploadCV(file, applicantId);
      }

      await applicationApi.apply({
        jobPostId,
        applicantId,
      });

      notification.success({
        message: "Application submitted",
      });
      queryClient.invalidateQueries({ queryKey: ["appliedJobs", applicantId] });
      setFileList([]);
      onClose();
    } catch (err: any) {
      notification.error({
        message: "Application failed",
        description: err.message,
      });
    } finally {
      setUploading(false);
    }
  };
  useEffect(() => {
    if (open && applicantId) {
      cvApi
        .getUserCV(applicantId)
        .then((cv) => {
          if (cv) {
            setExistingCv(cv);
            console.log("CV data from use effect", cv);
          }
        })
        .catch(() => {
          setExistingCv(null); // no CV found
        });
    }
  }, [open, applicantId]);
  return (
    <Modal
      title="Apply for Job"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Submit Application"
      confirmLoading={uploading}
    >
      <div style={{ marginBottom: 16 }}>
        <Text strong>Name:</Text> {userName}
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text strong>Email:</Text> {userEmail}
      </div>

      {existingCv ? (
        <Text>
          Using uploaded CV: <strong>{existingCv.fileName}</strong>
        </Text>
      ) : (
        <Upload
          beforeUpload={() => false}
          maxCount={1}
          accept="application/pdf"
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
        >
          <Button icon={<UploadOutlined />}>Upload CV (PDF)</Button>
        </Upload>
      )}
    </Modal>
  );
};

export default ApplyJobModal;
