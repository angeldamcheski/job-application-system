import React from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
type FieldType = {
  title: string;
  shortDescription: string;
  fullDescription: string;
  jobTags: string;
  jobStatus: string;
};
type Props = {
  form: any;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const CreateJobPost: React.FC<Props> = ({ form }) => {
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
      style={{ maxWidth: 800 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      form={form}
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
    </Form>
  );
};

export default CreateJobPost;
