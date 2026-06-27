import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
