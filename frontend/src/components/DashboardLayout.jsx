import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-800 to-green-700 text-white flex">
      <Sidebar />
      {/* Main content pushed right of sidebar */}
      <div className="flex-1 ml-60 min-h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
