import React from "react";

const EducationTab = ({ tab, setTab }) => {
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
          Courses
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
          Marketplace
        </button>
      </div>
      <div
        onClick={() => tab !== 3 && setTab(3)}
        className={tab === 3
          ? "bg-[#6469EE] text-[#FFFFFF] rounded-md"
          : "bg-[#FFFFFF] text-[#5E616D] rounded-md"
        }
      >
        <button className="text-[13px] font-bold px-3 py-2  rounded-md cursor-pointer">
          Purchased
        </button>
      </div>
    </div>
  );
};

export default EducationTab;
