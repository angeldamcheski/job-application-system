import { Layout, Menu } from "antd"
import HomePage from "./pages/HomePage"
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import JobListingsPage from "./pages/JobListingsPage";
const {Header, Content} = Layout;
function App() {
  
  return (
    <>
     <BrowserRouter>
    <Layout className="min-h-screen" style={{minHeight:"100vh"}}>
        <Header className="flex items-center bg-white border-b border-slate-100" style={{background: "white"}}>
          <Menu mode="horizontal" className="flex-1 border-none">
            <Menu.Item key="home">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="jobs">
              <Link to="/jobs">Manage Jobs</Link>
            </Menu.Item>
            
          </Menu>
          <span className="text-blue-500 font-semibold">JobHunt</span>
        </Header>

        <Content className="bg-white ">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobListingsPage />} />
          </Routes>
        </Content>
      </Layout>
     </BrowserRouter>
    </>
  )
}

export default App
