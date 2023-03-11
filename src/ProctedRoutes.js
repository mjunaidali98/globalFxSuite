import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStore } from "./store";

const ProtectedRoutes = ({ children }) => {
  const location = useLocation();
  const { dispatch } = useStore();
  const user = JSON.parse(localStorage.getItem("user"));
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    if (user) {
      let decode = jwtDecode(user.accessToken)
      // if (Date.now() >= (decode.exp * 1000)) {
      //   localStorage.removeItem("user");
      //   setExpired(true);
      // } else {
      dispatch({
        type: "SET_USER",
        payload: decode
      })
      // }
    }
  }, [])
  if (!user?.accessToken || expired) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children ? children : <Outlet />;
};

export default ProtectedRoutes;
