// import { useState } from "react";
// import { Card, Form, Input, Button, Tabs, message } from "antd";
// import { data, useNavigate } from "react-router-dom";
// import { useMutation } from "@tanstack/react-query";
// import { useAuth } from "../context/AuthContext";
// const AuthPage = () => {
//   const [mode, setMode] = useState("login");
//   const navigate = useNavigate();
//   const { login, register } = useAuth();
//   const mutation = useMutation({
//     mutationFn: async (values: any) => {
//       if (mode === "login") {
//         return await login(values);
//       } else {
//         const [firstName, ...rest] = values.name.split(" ");
//         const lastName = rest.join(" ");
//         return await register({
//           firstName,
//           lastName,
//           emailAddress: values.emailAddress,
//           password: values.password,
//         });
//       }
//     },
//     onSuccess: (data) => {
//       console.log("On Success data obj", data);
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data));
//       message.success(
//         `${mode === "login" ? "Login successful!" : "Registration successful!"}`,
//       );
//       navigate("/");
//     },
//     onError: (error) => {
//       message.error("An error occurred. Please try again.");
//     },
//   });
//   const onFinish = (values: any) => {
//     console.log(mode, values);
//     mutation.mutate(values);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-[80vh] bg-slate-50 px-4">
//       <Card className="w-full max-w-md shadow-lg rounded-xl">
//         <Tabs
//           centered
//           activeKey={mode}
//           onChange={(key) => setMode(key)}
//           items={[
//             { key: "login", label: "Login" },
//             { key: "register", label: "Register" },
//           ]}
//         />

//         <Form layout="vertical" onFinish={onFinish} className="mt-4">
//           {mode === "register" && (
//             <Form.Item
//               label="Full Name"
//               name="name"
//               rules={[{ required: true, message: "Please enter your name" }]}
//             >
//               <Input placeholder="John Doe" size="large" />
//             </Form.Item>
//           )}

//           <Form.Item
//             label="Email"
//             name="emailAddress"
//             rules={[{ required: true, message: "Please enter your email" }]}
//           >
//             <Input placeholder="email@example.com" size="large" />
//           </Form.Item>

//           <Form.Item
//             label="Password"
//             name="password"
//             rules={[{ required: true, message: "Please enter your password" }]}
//           >
//             <Input.Password placeholder="Password" size="large" />
//           </Form.Item>

//           <Button
//             type="primary"
//             htmlType="submit"
//             size="large"
//             className="w-full mt-2"
//           >
//             {mode === "login" ? "Login" : "Register"}
//           </Button>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default AuthPage;
import { useState } from "react";
import { Card, Form, Input, Button, Tabs, message } from "antd";
import { useNavigate } from "react-router-dom";
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
          emailAddress: values.emailAddress,
          password: values.password,
        });
      }
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      message.success(
        `${mode === "login" ? "Welcome back!" : "Account created!"}`,
      );
      navigate("/");
    },
    onError: (error) => {
      message.error("An error occurred. Please try again.");
    },
  });

  const onFinish = (values: any) => {
    mutation.mutate(values);
  };

  return (
    // Apple System Background (#F5F5F7)
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F7] px-4 selection:bg-blue-200">
      {/* Main Glass Card */}
      <Card
        bordered={false}
        className="w-full max-w-[420px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[32px] bg-white/70 backdrop-blur-2xl border border-white/60"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            {mode === "login" ? "Sign In" : "Create Account"}
          </h1>
          <p className="text-slate-400 mt-2 text-[15px]">
            {mode === "login"
              ? "Enter your details to continue."
              : "Join us to get started."}
          </p>
        </div>

        <Tabs
          centered
          activeKey={mode}
          onChange={(key) => setMode(key)}
          tabBarStyle={{ borderBottom: "none", marginBottom: "24px" }}
          items={[
            {
              key: "login",
              label: <span className="px-4 font-medium text-base">Login</span>,
            },
            {
              key: "register",
              label: (
                <span className="px-4 font-medium text-base">Register</span>
              ),
            },
          ]}
        />
  
        <Form
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className="space-y-1"
        >
          {mode === "register" && (
            <Form.Item
              label={
                <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Full Name
                </span>
              }
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input
                placeholder="John Doe"
                className="h-12 rounded-xl bg-slate-100/50 border-none hover:bg-slate-100 focus:bg-white transition-all"
              />
            </Form.Item>
          )}

          <Form.Item
            label={
              <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Email
              </span>
            }
            name="emailAddress"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input
              placeholder="email@example.com"
              className="h-12 rounded-xl bg-slate-100/50 border-none hover:bg-slate-100 focus:bg-white transition-all"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Password
              </span>
            }
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              placeholder="••••••••"
              className="h-12 rounded-xl bg-slate-100/50 border-none hover:bg-slate-100 focus:bg-white transition-all"
            />
          </Form.Item>

          <div className="pt-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={mutation.isPending}
              className="w-full h-12 rounded-2xl bg-[#007AFF] hover:bg-[#0062CC] border-none text-[16px] font-semibold shadow-md active:scale-[0.98] transition-all"
            >
              {mode === "login" ? "Sign In" : "Get Started"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AuthPage;
