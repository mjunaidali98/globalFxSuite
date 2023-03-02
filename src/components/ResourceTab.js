import React from "react";
import { NavLink } from "react-router-dom";

const ResourceTab = () => {
  return (
    <div className="flex items-center space-x-2">
      <NavLink
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
      </NavLink>
    </div>
  );
};

export default ResourceTab;
