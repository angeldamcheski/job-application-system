import React from "react";
import type { FormProps } from "antd";
import { Form, Input, Select } from "antd";

type JobStatus = "ACTIVE" | "INACTIVE";
type FieldType = {
  title: string;
  shortDescription: string;
  fullDescription: string;
  jobTags: string;
  jobStatus: JobStatus;
};
type Props = {
  form: any;
  initialValues: FieldType;
};
const EditJobPost: React.FC<Props> = ({ form, initialValues }) => {
  return (
    <Form
      form={form}
      name="editJobPost"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
      style={{ maxWidth: 800 }}
      initialValues={initialValues}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please enter the Title" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Short Description"
        name="shortDescription"
        rules={[
          { required: true, message: "Please enter the short description" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Full Description"
        name="fullDescription"
        rules={[
          { required: true, message: "Please enter the full description" },
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item label="Tags (comma separated)" name="jobTags">
        <Input placeholder="React, TypeScript, Spring" />
      </Form.Item>

      <Form.Item<FieldType>
        label="Status"
        name="jobStatus"
        rules={[{ required: true, message: "Please select the job status" }]}
      >
        <Select>
          <Select.Option value="ACTIVE">ACTIVE</Select.Option>
          <Select.Option value="INACTIVE">INACTIVE</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default EditJobPost;
