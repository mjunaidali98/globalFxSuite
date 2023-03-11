import React from "react";
// import { NavLink } from "react-router-dom";

const ResourceTab = ({ tab, setTab }) => {
  return (
    <div className="flex items-center space-x-2">
      <div
        onClick={() => tab !== 1 && setTab(1)}
        className={
          tab === 1
            ? "bg-[#6469EE] rounded-md text-[#FFFFFF]"
            : "bg-[#FFFFFF] text-[#5E616D] rounded-md"
        }
      >
        <button className="text-[13px] font-bold px-3 py-2 rounded-md cursor-pointer">
          Downloads
        </button>
      </div>
      <div
        onClick={() => tab !== 2 && setTab(2)}
        className={
          tab === 2
            ? "bg-[#6469EE] text-[#FFFFFF] rounded-md"
            : "bg-[#FFFFFF] text-[#5E616D] rounded-md"
        }
      >
        <button className=" text-[13px] font-bold px-3 py-2 rounded-md cursor-pointer">
          Articles
        </button>
      </div>

      <div
        onClick={() => tab !== 3 && setTab(3)}
        className={
          tab === 3
            ? "bg-[#6469EE] text-[#FFFFFF] rounded-md"
            : "bg-[#FFFFFF] text-[#5E616D] rounded-md"
        }
      >
        <button className=" text-[13px] font-bold px-3 py-2 rounded-md cursor-pointer">
          Saved
        </button>
      </div>
      {/* <NavLink
        to="/resource"
        className={({ isActive }) =>
          isActive
            ? "bg-[#6469EE] rounded-md text-[#FFFFFF]"
            : "bg-[#FFFFFF] text-[#5E616D] rounded-md"
        }
      >
        <button className="text-[13px] font-bold px-3 py-2 rounded-md cursor-pointer">
          Downloads
        </button>
      </NavLink>
      <NavLink
        to="/article"
        className={({ isActive }) =>
          isActive
            ? "bg-[#6469EE] text-[#FFFFFF] rounded-md"
            : "bg-[#FFFFFF] text-[#5E616D] rounded-md"
        }
      >
        <button className=" text-[13px] font-bold px-3 py-2 rounded-md cursor-pointer">
          Articles
        </button>
      </NavLink>
      <NavLink
        to="/saves"
        className={({ isActive }) =>
          isActive
            ? "bg-[#6469EE] text-[#FFFFFF] rounded-md"
            : "bg-[#FFFFFF] text-[#5E616D] rounded-md"
        }
      >
        <button className=" text-[13px] font-bold px-3 py-2 rounded-md cursor-pointer">
          Saves
        </button>
      </NavLink> */}
    </div>
  );
};

export default ResourceTab;
