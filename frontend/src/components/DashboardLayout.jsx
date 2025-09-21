import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="antialiased bg-white dark:bg-gray-900">
      <Sidebar />
      <main className="p-4 md:ml-64 h-auto pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
