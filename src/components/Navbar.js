import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { leftSidebarData } from "../utils/leftSidebarData";

const Navbar = () => {
  const { pathname } = useLocation();

  const [active, setActive] = useState(pathname);
  const [hamber, setHamber] = useState(false);

  return (
    <div className="h-[100px] flex items-center justify-between w-full bg-[#FFFFFF] border-b ">
      <div className="inline-flex md:hidden w-full px-7 items-center justify-between">
        <Link to="/">
          <img
            className="w-[182px] cursor-pointer h-[47px]"
            src="images/Dashboard_Main_Logo.svg"
            alt="logo"
          />
        </Link>
        <img
          onClick={() => setHamber(!hamber)}
          className="z-20 w-[32px] h-[32px] cursor-pointer"
          src="images/menu 1.png"
          alt="hamber"
        />
      </div>

      <nav
        data-te-sidenav-hidden={hamber}
        className={`${hamber ? "-translate-x-0 " : "translate-x-full"
          } h-screen w-80 absolute transition-all duration-500 ease-in-out right-0 inline-flex md:hidden  md:justify-center items-start bg-[#fff] top-0 min-h-screen `}
      >
        <div className="grid gap-y-10 mt-[100px] w-full text-[#FFFFFF] p-5">
          {leftSidebarData.map(({ id, icon, selectedIcon, name, link }) => (
            <NavLink onClick={() => setActive(link)} key={id} to={link}>
              <div className="flex items-center space-x-4 cursor-pointer transition-all duration-75">
                <img
                  alt=""
                  className="w-[17px] h-5"
                  src={active === link ? selectedIcon : icon}
                />
                <p
                  className={`text-[16px] font-bold ${active === link ? "text-[#426BFF]" : "text-[#000]"
                    }`}
                >
                  {name}
                </p>
              </div>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="lg:w-[495px] hidden md:inline-flex w-[300px] ml-5 xl:ml-[38px] bg-[#F4F4F4] space-x-4 rounded-full items-center px-4 h-[59px]">
        <img
          src="images/Dashboard_Search_Icon.png"
          alt="search_icon"
          className="w-[17px] ml-2"
        />
        <input
          type="text"
          placeholder="Search your favorite course"
          className="outline-none w-full bg-transparent"
        />
      </div>
      <div className="hidden md:inline-flex items-center space-x-2 pr-3">
        <p className="p-3 rounded-full cursor-pointer bg-[#F4F4F4]">
          <img
            className="w-[19px]"
            src="images/Dashboard_Chat_Icon.png"
            alt="message_icon"
          />
        </p>
        <p className="p-3 rounded-full cursor-pointer bg-[#F4F4F4]">
          <img
            className="w-[19px]"
            src="images/Dashboard_Notification_Icon.png"
            alt="message_icon"
          />
        </p>
      </div>
    </div>
  );
};

export default Navbar;
