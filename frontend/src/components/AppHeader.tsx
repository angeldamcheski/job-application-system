import { Button, Dropdown, Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Dropdown menu for logged-in user
  const userMenuItems = [
    {
      key: "logout",
      label: <span onClick={logout}>Logout</span>,
    },
  ];

  return (
    <Header
      className="flex items-center justify-between bg-white border-b border-slate-100"
      style={{ background: "white" }}
    >
      <Menu mode="horizontal" className="flex-1 border-none">
        <Menu.Item key="home">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="jobs">
          <Link to="/jobs">Available Jobs</Link>
        </Menu.Item>
      </Menu>

      {user ? (
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <Button type="text" className="font-semibold text-blue-500">
            {user.firstName}
          </Button>
        </Dropdown>
      ) : (
        <Button type="primary" onClick={() => navigate("/auth")}>
          Login
        </Button>
      )}
    </Header>
  );
};

export default AppHeader;
