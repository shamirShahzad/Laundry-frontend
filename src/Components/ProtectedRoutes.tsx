import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Sham_LoadingOverlay from "./Sham_LoadingOverlay";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoutes = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  if (loading)
    return <Sham_LoadingOverlay loading={loading} children={<Outlet />} />;
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
