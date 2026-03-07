import { useState } from "react";
import { Card, Form, Input, Button, Tabs, message } from "antd";
import { data, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const mutation = useMutation({
    mutationFn: async (values: any) => {
      if (mode === "login") {
        return await login(values);
      } else {
        const [firstName, ...rest] = values.name.split(" ");
        const lastName = rest.join(" ");
        return await register({
          firstName,
          lastName,
          emailAddress: values.email,
          password: values.password,
        });
      }
    },
    onSuccess: (data) => {
      console.log("On Success data obj", data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      message.success(
        `${mode === "login" ? "Login successful!" : "Registration successful!"}`,
      );
      navigate("/");
    },
    onError: (error) => {
      message.error("An error occurred. Please try again.");
    },
  });
  const onFinish = (values: any) => {
    console.log(mode, values);
    mutation.mutate(values);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl">
        <Tabs
          centered
          activeKey={mode}
          onChange={(key) => setMode(key)}
          items={[
            { key: "login", label: "Login" },
            { key: "register", label: "Register" },
          ]}
        />

        <Form layout="vertical" onFinish={onFinish} className="mt-4">
          {mode === "register" && (
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input placeholder="John Doe" size="large" />
            </Form.Item>
          )}

          <Form.Item
            label="Email"
            name="emailAddress"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input placeholder="email@example.com" size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Password" size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full mt-2"
          >
            {mode === "login" ? "Login" : "Register"}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default AuthPage;
