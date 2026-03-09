import { Layout, Menu } from "antd";
import { lazy } from "react";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Route, Routes, Link, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppHeader from "./components/AppHeader";
import { useAuth } from "./context/AuthContext";
import ProfilePage from "./pages/ProfilePage";
import AppliedJobDetailsPage from "./pages/AppliedJobDetailsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
const JobListingsPage = lazy(() => import("./pages/JobListingsPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));

const { Content } = Layout;

// Create a client
const queryClient = new QueryClient();
function App() {
  const { user } = useAuth();
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
                <Route
                  path="/profile"
                  element={user ? <ProfilePage /> : <AuthPage />}
                />
                <Route
                  path="/profile/applications/:id"
                  element={<AppliedJobDetailsPage />}
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    user?.role === "ADMIN" ? (
                      <AdminDashboardPage />
                    ) : (
                      <Navigate to="/" replace />
                    )
                  }
                />
              </Routes>
            </Content>
          </Layout>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
