import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user?.accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children ? children : <Outlet />;
};

export default ProtectedRoutes;
