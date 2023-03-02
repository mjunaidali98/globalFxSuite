import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { leftSidebarData } from "../utils/leftSidebarData";
import { getAuth, signOut } from "firebase/auth";

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const logOut = () => {
    try {
      const auth = getAuth();
      signOut(auth)
        .then((res) => {
          console.log("Res", res)
          // Sign-out successful.
          localStorage.removeItem("user");
          navigate("/login")
        })
        .catch((error) => {
          // An error happened.
          console.log("err:logout", error)
        });
    } catch (err) {
      console.log("Err", err)
    }
  };
  return (
    <div className="bg-[#FFFFFF] sticky top-10 pl-8 w-[250px]">
      <div>
        <Link to="/">
          <img
            className="w-[130px] cursor-pointer h-[47px] mt-10"
            src="images/Dashboard_logo.jpeg"
            alt="logo"
          />
        </Link>
      </div>
      <div className="grid gap-y-10 mt-[100px]">
        {leftSidebarData.map(({ id, icon, selectedIcon, name, link }) => (
          <NavLink key={id} to={link}>
            <div
              className={`${pathname === link && "border-r-4"
                } flex items-center space-x-4 cursor-pointer transition-all duration-75 hover:border-r-4 border-[#426BFF]`}
            >
              <img
                className="w-[17px] h-5"
                src={pathname === link ? selectedIcon : icon}
                alt="icon"
              />
              <p
                className={`text-[16px] font-bold ${pathname === link ? "text-[#426BFF]" : "text-[#5E616D]"
                  }`}
              >
                {name}
              </p>
            </div>
          </NavLink>
        ))}
        <button onClick={logOut} className="mt-[2.8rem] bg-[#F64E60] text-[#FFFFFF] rounded-lg w-[172px] h-[43px] text-center text-[12px] font-semibold">
          Log out
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;
