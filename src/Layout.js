import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import Navbar from "./components/Navbar";
import RightSidebar from "./components/RightSidebar";

const Layout = () => {
  return (
    <div className="flex min-h-screen overflow-x-hidden justify-between">
      <div className="border-r-2 min-h-screen max-h-screen sticky top-0 hidden md:block">
        <LeftSidebar />
      </div>
      <div className="min-h-screen max-h-screen flex-1 w-full">
        <div className="sticky top-0">
          <Navbar />
        </div>
        <div
          style={{ minHeight: "calc(100vh - 100px)" }}
          className="bg-[#F6F6F6]">
          <Outlet />
        </div>
      </div>
      <div className="max-h-screen hidden xl:block scrollbar_edit overflow-y-auto sticky top-0">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Layout;
