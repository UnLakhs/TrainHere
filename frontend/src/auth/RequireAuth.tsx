import { Navigate, Outlet, useLocation } from "react-router-dom";
import { hasAuthToken } from "../api/auth/auth";

const RequireAuth = () => {
  const location = useLocation();

  if (!hasAuthToken()) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
};

export default RequireAuth;
