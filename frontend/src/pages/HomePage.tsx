// import { useAuth } from "../context/AuthContext";

// const HomePage = () => {
//   const { user } = useAuth();
//   return (
//     <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-linear-to-br from-white  to-blue-100 ">
//       <h1 className="text-5xl font-light">
//         Welcome{user ? ", " : " to "}
//         <span className="font-semibold text-blue-600">
//           {user ? user.firstName : "JobHunt"}
//         </span>
//       </h1>
//       <p className="text-xl text-center py-1.5">
//         Select a section from the menu to get started
//       </p>
//     </div>
//   );
// };

// export default HomePage;
import { Avatar } from "antd";
import { useAuth } from "../context/AuthContext";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const HomePage = () => {
  const { user } = useAuth();

  const greeting = user ? `Hey ${user.firstName}` : "Welcome to JobHunt";

  return (
    <div className="min-h-[calc(100vh-64px)] bg-linear-to-br from-zinc-50 via-white to-blue-50 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Very subtle background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(at_50%_30%,rgba(147,197,253,0.08),transparent)]" />

      <div className="max-w-md text-center space-y-10 relative">
        {/* Optional subtle illustration / icon */}
        <div className="mx-auto w-20 h-20 bg-white rounded-full shadow-xl shadow-blue-100 flex items-center justify-center border border-white">
          <Avatar icon={<UserOutlined />} size={70} />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-light tracking-tighter text-zinc-900">
            {greeting}
          </h1>

          <p className="text-2xl font-light text-zinc-500 tracking-tight">
            {user
              ? "What would you like to do today?"
              : "Your next opportunity is just a few clicks away."}
          </p>
        </div>

        <div className="pt-6">
          <p className="text-base text-zinc-400 font-light max-w-xs mx-auto">
            Select a section from the sidebar to get started
          </p>
        </div>

        {/* Optional subtle CTA buttons — very Apple style */}
        {user && (
          <div className="flex gap-3 justify-center pt-8">
            {user.role === "ADMIN" ? (
              <>
                <Link to="/admin/dashboard">
                  <button className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-medium transition-all active:scale-[0.985] shadow-sm">
                    Manage Applicants
                  </button>
                </Link>

                <Link to="/admin/manage-applications">
                  <button className="px-8 py-3.5 bg-white border border-zinc-200 hover:border-zinc-300 rounded-2xl text-sm font-medium text-zinc-700 transition-all active:scale-[0.985]">
                    Manage Applications
                  </button>
                </Link>
              </>
            ) : (
              // Default for Applicant / Candidate
              <>
                <Link to="/jobs">
                  <button className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-medium transition-all active:scale-[0.985] shadow-sm">
                    Browse Jobs
                  </button>
                </Link>

                <Link to="/profile">
                  <button className="px-8 py-3.5 bg-white border border-zinc-200 hover:border-zinc-300 rounded-2xl text-sm font-medium text-zinc-700 transition-all active:scale-[0.985]">
                    My Applications
                  </button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
