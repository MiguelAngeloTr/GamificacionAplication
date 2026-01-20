import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./Context";
import Spinner from "../components/ui/Spinner";

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { loading, isAuthenticated, roles } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner fullScreen label="Verificando acceso..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (!allowedRoles.length) {
    return <Outlet />;
  }

  const hasAllowedRole = allowedRoles.some((r) => roles.includes(r));
  if (!hasAllowedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
