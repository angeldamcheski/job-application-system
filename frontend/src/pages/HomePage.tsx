import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-linear-to-br from-white  to-blue-100 ">
      <h1 className="text-5xl font-light">
        Welcome{user ? ", " : " to "}
        <span className="font-semibold text-blue-600">
          {user ? user.firstName : "JobHunt"}
        </span>
      </h1>
      <p className="text-xl text-center py-1.5">
        Select a section from the menu to get started
      </p>
    </div>
  );
};

export default HomePage;
