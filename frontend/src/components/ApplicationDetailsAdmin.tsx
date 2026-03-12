import { Descriptions, Modal } from "antd";
import { useState } from "react";

const ApplicationDetailsAdmin: React.FC<{
  application: any;
  visible: boolean;
  onClose: () => void;
  onStatusChange: (newStatus: string) => void;
}> = ({ application, visible, onClose, onStatusChange }) => {
  const [status, setStatus] = useState(application.applicationStatus);
  console.log(application);
  return (
    <Modal
      title={`Application Details - ${application?.jobPost?.title}`}
      open={visible}
      onCancel={onClose}
      onOk={() => onStatusChange(status)}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Applicant">{`${application.applicant?.firstName} ${application.applicant?.lastName}`}</Descriptions.Item>
        <Descriptions.Item label="Email">
          {application.applicant?.emailAddress}
        </Descriptions.Item>
        <Descriptions.Item label="Phone">
          {application.applicant?.phoneNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Job">
          {application.jobPost?.title}
        </Descriptions.Item>
        <Descriptions.Item label="Submitted">
          {new Date(application?.submittedDate).toLocaleDateString()}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded p-1"
          >
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="IN_REVIEW">IN_REVIEW</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};
export default ApplicationDetailsAdmin;
