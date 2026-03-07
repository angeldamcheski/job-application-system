import { Layout, Menu } from "antd";
import { lazy } from "react";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppHeader from "./components/AppHeader";
const JobListingsPage = lazy(() => import("./pages/JobListingsPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));

const { Content } = Layout;

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Layout className="min-h-screen" style={{ minHeight: "100vh" }}>
            <AppHeader />
            <Content className="bg-white ">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/jobs" element={<JobListingsPage />} />
                <Route path="/auth" element={<AuthPage />} />
              </Routes>
            </Content>
          </Layout>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
