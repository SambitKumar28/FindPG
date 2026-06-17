import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * <ProtectedRoute roles={["admin"]} />
 *
 * - While session is being restored, renders nothing (avoids flash of login page).
 * - Unauthenticated users are sent to /login with the intended URL saved in state
 *   so they can be redirected back after logging in.
 * - Authenticated users whose role is not in the allowed list get a 403 page.
 */
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or a full-page spinner

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
